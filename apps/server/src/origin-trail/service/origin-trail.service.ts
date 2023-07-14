import { Injectable } from '@nestjs/common';
import * as DKG from 'dkg.js'
import {DkgAssertionService} from './dkg-assertion.service';
import {PhoneHandoverDto} from '../model/phone-handover-dto';
import {DkgResult} from '../model/dkg-result.model';
import {
    getCountsByState, getCountsByBrand,
    getTotalCountGroups,
    phoneByDisposalEmailQuery,
    phoneByUserId,
    phoneById,
    phoneByImei,
    phoneByQuery, getByState
} from '../queries/dkg-queries';
import {PhoneQuery} from '../../../../../libs/shared_models/model/phone-query.model';
import {UalPhoneMapperUtil} from '../../../../../libs/util/ual-phone-mapper.util';
import {OtPhoneParametersModel} from '../../../../../libs/shared_models/model/ot-phone-parameters.model';
import { GenerateImageOutput } from 'src/image-generation/model/generate-image-output';
import {RecycleState} from '../../../../../libs/shared_models/enum/recycleState';
import {StateUtil} from '../../../../../libs/util/state.util';
import {HelperUtil} from '../../app/util/helper.util';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {UserService} from '../../authorization/service/user.service';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';
import { ImageGenerationService } from 'src/image-generation/service/image-generation.service';
import { PinataService } from 'src/pinata/service/pinata.service';
import {RdfTripletHelper} from '../../phone/helper/rdf-triplet.helper';
import {ChangeStateBody} from '../../../../../libs/shared_models/model/change-state-body.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPhoneEntity } from 'src/core/entities/user-phone.entity';
import { Repository } from 'typeorm';
import { MaterialsEntity } from 'src/core/entities/materials.entity';
import * as moment from 'moment';

@Injectable()
export class OriginTrailService {

    public NFT_STATES = [RecycleState.RECYCLED, RecycleState.REFURBISHED]
    dkg: any;

    constructor(
        @InjectRepository(UserPhoneEntity) private readonly userPhoneRepository: Repository<UserPhoneEntity>,
        private dkgAssertionService: DkgAssertionService,
        private userService: UserService,
        private imageGenerationService: ImageGenerationService,
        private pinataService: PinataService,
    ) {
        this.dkg = new DKG({
            epochsNum: 2,
            endpoint: process.env.OT_NODE,
            port: 8900,
            useSSL: true,
            loglevel: "trace",
            blockchain: {
                name: "otp::testnet",
                publicKey:  process.env.OT_NODE_PUBLIC_KEY,
                privateKey: process.env.OT_NODE_PRIVATE_KEY,
            },
        });
    }

    public async getInfo() {
        return await this.dkg.node.info();
    }

    public async insertPhone(phone: PhoneEntity, data: PhoneHandoverDto, currentUser: UserPayload, ownerId: string, generateImageOutput: GenerateImageOutput, dbId: string): Promise<string> {
        const asset = this.dkgAssertionService.convertPhoneToHandOverAssertion(phone, data, ownerId, currentUser, generateImageOutput, dbId);
        const {ual} = await this.insertData(asset);

        return ual;
    }

    public async insertData(data: any): Promise<{ual: string}> {
        const result  = await this.dkg.asset.create({public: data});

        await this.dkg.asset.waitFinalization(result.UAL);
        return {ual: result.UAL};
    }

    public async getDataByQuery<T>(phoneQuery: PhoneQuery): Promise<{data: DkgResult<T>, totalCount: number}> {
        const options = {state: 'LATEST_FINALIZED', graphState: 'CURRENT'}
        // graphState: 'HISTORICAL'
        const [result, data] = await Promise.all([
            this.dkg.graph.query(getTotalCountGroups(phoneQuery), 'SELECT', options),
            await this.dkg.graph.query(phoneByQuery(phoneQuery), 'SELECT', options)
        ]);

        return {data, totalCount: result.data[0]?.total || data.length};
    }

    public async getDataByUser<T>(email: string):Promise<{data: DkgResult<T>, totalCount: number}> {
        const data = await this.dkg.graph.query(phoneByUserId(email), 'SELECT', {state: 'LATEST_FINALIZED', graphState: 'CURRENT'});
        return {data, totalCount: data.length};
    }

    public sumMaterials(materials: MaterialsEntity[]) {
        const result: {material: string, sum: number}[] = [];
        const materialsNames = ['plastic', 'glass', 'gold', 'silver', 'paladium', 'platinum', 'aluminium', 'copper', 'lithium'];

        for(const materialName of materialsNames){
            let total = 0;
            for(const material of materials){
                total += material[materialName];
            }
            result.push({material: materialName, sum: total});
        }
        return result;
    }

    public async getStatistics(): Promise<any> {
        const options = {state: 'LATEST_FINALIZED', graphState: 'CURRENT'};
        const result: {data: {state: string, count: number}[]} = await this.dkg.graph.query(getCountsByState(), 'SELECT', options);
        const endStates = [RecycleState.RECYCLED, RecycleState.REFURBISHED, RecycleState.RESOLD];
        const countsByBrands = await this.dkg.graph.query(getCountsByBrand(), 'SELECT',);

        // material graph
        const recycledPhones = await this.userPhoneRepository.find({where: {state: RecycleState.RECYCLED}, relations: ['phone','phone.materials']});
        const allMaterials = [];
        recycledPhones.map(userPhone => {
            allMaterials.push(userPhone.phone.materials);
        })
        const summedMaterials = this.sumMaterials(allMaterials);
        return {stateStatistics: result.data
            .map(data => HelperUtil.removeDoubleQuotes(data))
            .filter(statisticData => {
            return endStates.includes(statisticData.state)
        }), countsByBrands: countsByBrands.data.sort((a, b) => b.count - a.count), summedMaterials: summedMaterials.sort((a, b) => b.sum - a.sum)}
    }

    public async getDataByDisposalEmail<T>(email: string): Promise<DkgResult<T>> {
        const data = await this.dkg.graph.query(phoneByDisposalEmailQuery(email), 'SELECT')
        return data;
    }


    public async getDataById(id: string): Promise<any> {
        const data = await this.dkg.graph.query(phoneById(id), 'SELECT')
        return data;
    }

    public async getDataByImei<T>(imei: string): Promise<DkgResult<T>> {
        const data = await this.dkg.graph.query(phoneByImei(imei), 'SELECT')
        return data;
    }

    public async getDataByHistoryImei<T>(imei: string): Promise<DkgResult<T>> {
        const options = {
            graphState: 'HISTORICAL',
            state: 'LATEST_FINALIZED'
        }

        const history = await this.dkg.graph.query(phoneByImei(imei), 'SELECT', options)
        const latestState = await this.dkg.graph.query(phoneByImei(imei), 'SELECT', { state: 'LATEST_FINALIZED' })

        // todo: fix cause the graph is returning the same objects
        const data =[...history.data, ...latestState.data];
        return {...history, data};
    }

    public async getEntityHistoryByUal(ual:string): Promise<any> {

        const getStatesResult = await this.dkg.asset.getStates(ual);

        const historicalData = await Promise.all(getStatesResult.states.map(async (stateId, index) => {
            const graphState = index === (getStatesResult.states.length - 1 ) ? 'CURRENT' : 'HISTORICAL';
            const stateData = await this.dkg.graph.query(getByState(stateId),
                'CONSTRUCT',
                {
                    graphState
                });

                return stateData
        }));
        return RdfTripletHelper.parseRDFObjects(historicalData);
        // const asset = this.dkg.asset;
        // if (!asset) {
        //     return;
        // }
        // const ualData = await this.dkg.asset.get(ual, {
        //     graphState: 'HISTORICAL'
        // });
        //
        // console.log('HISTORICAL OBJECT', ualData);
        // return ualData;
        // return this.convertAssertionToObject(ualData);
    }

    public async getEntityByUal(ual:string): Promise<any> {
        const asset = this.dkg.asset;
        if (!asset) {
            return;
        }
        const ualData = await this.dkg.asset.get(ual, {
            blockchain: {
                name: "otp::testnet",
                publicKey:  process.env.OT_NODE_PUBLIC_KEY,
                privateKey: process.env.OT_NODE_PRIVATE_KEY,
            }
        });

        return ualData;
        // return this.convertAssertionToObject(ualData);
    }

    // public async addDisposalToThePhone(ual: string, phoneDisposableDto: PhoneDisposableDto, email: string): Promise<OtPhoneParametersModel> {
    //     const phoneUal = await this.getEntityByUal(ual);
    //     const phoneData = UalPhoneMapperUtil.mapUalToPhone(phoneUal);
    //     const currentUser = await this.userService.getUserByEmail(email);
    //
    //     const phoneJson = this.dkgAssertionService.addDisposalToThePhone(phoneDisposableDto, currentUser, phoneData);
    //     // console.log('PHONE TO BE UPDATED', phoneJson);
    //     return await this.updateData(ual, phoneJson);
    // }

    public async changePhoneState(ual: string, params: ChangeStateBody, currentUser: UserPayload): Promise<OtPhoneParametersModel> {
        const phoneUal = await this.getEntityByUal(ual);
        const phoneData = UalPhoneMapperUtil.mapUalToPhone(phoneUal);

        if (phoneData.state !== params.state) {
            //let generatedImageOutput = null;
            //let metadataIpfs = null;
            //if (this.NFT_STATES.includes(state)) {
            //    generatedImageOutput = await this.imageGenerationService.generateImageFast(phoneData.model, phoneData.imei);
            //    metadataIpfs = await this.pinataService.uploadNftMetadata(phoneData.model, phoneData.imei, generatedImageOutput.compositeIpfs);
            //}

            const phoneJson = this.dkgAssertionService.convertToOtPhoneJson( {
                ...phoneData,
                ...params,
                //phoneIpfs: generatedImageOutput?.phoneIpfs,
                //backgroundIpfs: generatedImageOutput?.backgroundIpfs,
                //compositeIpfs: generatedImageOutput?.compositeIpfs,
                //metadataIpfs,
                location: {
                    name: currentUser.company?.name,
                    longitude: currentUser.company?.longitude,
                    latitude: currentUser.company?.latitude
                }
            });

            const updatedPhone = await this.updateData(ual, phoneJson);
            return updatedPhone;
        }
        return phoneData;
    }

    public async updateData(ual: string, updatedData: any): Promise<any> {
        // await this.dkg.asset.increaseAllowance('1569429592284014000');
        let currentTime = moment();
        await this.dkg.asset.update(ual, {public: updatedData});
        console.log('UPDATE TOOK', moment().diff(currentTime, 'seconds'));
        currentTime = moment();
        if (!process.env.PRESENTATION_MODE) {
            console.log('STARTING FINALIZATION');
            await this.dkg.asset.waitFinalization(ual);
            console.log('FINALIZATION TOOK ', moment().diff(currentTime, 'seconds'));
        }
        return ual;
    }

    public async updatedAllowance() {
        return await this.dkg.asset.increaseAllowance('1569429592284014000');
    }

    public async queryData(str: string): Promise<any> {
        const result = await this.dkg.graph.query(
            `prefix schema: <http://schema.org/>
        SELECT *
        where {
            ?s schema:email ?email .
        }`, 'SELECT'
        );

        // const data = JSON.stringify(result, null, 2);
        return result;
    }
}
