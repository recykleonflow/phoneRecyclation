import {Injectable} from '@nestjs/common';
import {PhoneHandoverDto} from '../model/phone-handover-dto';
import {v4 as uuid} from 'uuid';
import {RecycleState} from '../../../../../libs/shared_models/enum/recycleState';
import {PhoneDisposableDto} from '../../../../../libs/shared_models/model/phone-disposable-dto.model';
import {OtPhoneJson} from '../../../../../libs/shared_models/model/ot-phone-json.model';
import {OtPhoneParametersModel} from '../../../../../libs/shared_models/model/ot-phone-parameters.model';
import { GenerateImageOutput } from 'src/image-generation/model/generate-image-output';
import {ID_PREFIX} from './const';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {UserEntity} from '../../core/entities/user.entity';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';
import {OtHelper} from '../ot-helper';


@Injectable()
export class DkgAssertionService {

    public convertToOtPhoneJson(phoneData: OtPhoneParametersModel): OtPhoneJson {
        return new OtPhoneJson(phoneData)
    }

    // public addDisposalToThePhone(phoneDisposableDto: PhoneDisposableDto, currentUser: UserPayload, phoneData: OtPhoneParametersModel): OtPhoneJson {
    //
    //     return new OtPhoneJson({
    //         ...phoneData,
    //         state: RecyclationState.IN_TRANSIT,
    //         disposal: {
    //             name: currentUser.company?.name,
    //             method: phoneDisposableDto.method,
    //             email: currentUser.email,
    //             latitude: currentUser.company?.latitude,
    //             longitude: currentUser.company?.longitude
    //         }
    //     })
    // }

    public convertPhoneToHandOverAssertion(
        phone: PhoneEntity,
        handoverData: PhoneHandoverDto,
        ownerId: string,
        currentUser: UserEntity,
        generateImageOutput: GenerateImageOutput,
        dbId: string,
    ): OtPhoneJson {
        // mozno aj burza ze pred recyklaciou to niekto bude chciet odkupit?
        const otPhoneJson = new OtPhoneJson({
            id: ID_PREFIX+dbId,
            phoneIpfs: generateImageOutput?.phoneIpfs,
            backgroundIpfs: generateImageOutput?.backgroundIpfs,
            compositeIpfs: generateImageOutput?.compositeIpfs,
            metadataIpfs: generateImageOutput?.metadataIpfs,
            imei: handoverData.imei,
            brand: phone.brand,
            model: phone.model,
            createdAt: OtHelper.generateOtDate(),
            owner: ownerId,
            batteryExtracted: false,
            materialsExtracted: false,
            visualCondition: handoverData.visualCondition,
            state: RecycleState.RECEIVED,
            technicalSpecification: {
                processor: "Snapdragon 888",
                ram: 0,
                storage: "128 GB"
            },
            handover: {
                date: OtHelper.generateOtDate(),
                email: currentUser.email,
                company: currentUser.company?.name
            },
            location: {
                name: currentUser.company?.name,
                latitude: currentUser.company?.latitude,
                longitude: currentUser.company?.longitude
            }
        })
        return otPhoneJson;
    }
}
