import {Body, Controller, Get, HttpCode, Param, Post, Query} from '@nestjs/common';
import {CurrentUser} from '../../../authorization/decorator/current-user.decorator';
import {AuthorizedResource} from '../../../authorization/decorator/authorized.resource';
import {OriginTrailService} from '../../../origin-trail/service/origin-trail.service';
import {UserPhoneSimple} from '../../../../../../libs/shared_models/model/user-phones-simple.model';
import {PhoneDisposableDto} from '../../../../../../libs/shared_models/model/phone-disposable-dto.model';
import {PaginatedResult} from '../../../../../../libs/shared_models/model/paginated-result.model';
import {PhoneQuery} from '../../../../../../libs/shared_models/model/phone-query.model';
import {PhoneType} from '../../../../../../libs/shared_models/enum/phone-type.enum';
import {PhoneHandlerService} from '../../service/phone-handler/phone-handler.service';
import {PhoneHandoverDto} from '../../../origin-trail/model/phone-handover-dto';
import { ImageGenerationService } from 'src/image-generation/service/image-generation.service';
import { PinataService } from 'src/pinata/service/pinata.service';
import {RecycleState} from '../../../../../../libs/shared_models/enum/recycleState';
import {PhonePayload} from '../../../../../../libs/shared_models/model/phone-payload.model';
import {PhoneModelService} from '../../service/phone-model.service';
import {UserPayload} from '../../../../../../libs/shared_models/model/user-payload.model';
import { PhoneMappingService } from 'src/phone/service/phone-handler/phone-mapping.service';
import { UserPhonePayload } from '../../../../../../libs/shared_models/model/user-phone-payload';
import {OtPhoneParametersModel} from '../../../../../../libs/shared_models/model/ot-phone-parameters.model';
import {ChangeStateBody} from '../../../../../../libs/shared_models/model/change-state-body.model';
import {SimpleRequestPhone} from '../../../../../../libs/shared_models/model/simple-request-phone.model';

@Controller('phone')
export class PhoneController {
    constructor(
                private phoneMappingService: PhoneMappingService,
                private originTrailService: OriginTrailService,
                private phoneModelService: PhoneModelService,
                private phoneHandlerService: PhoneHandlerService) {}

    @Get('')
    @AuthorizedResource()
    public async getRecycledPhones(@CurrentUser() user: UserPayload, @Query() phoneQuery?: PhoneQuery): Promise<PaginatedResult<UserPhonePayload>> {
        const result = phoneQuery.type === PhoneType.MINE
            ? await this.originTrailService.getDataByUser<UserPhoneSimple>(user.id)
            : await this.originTrailService.getDataByQuery<UserPhoneSimple>(phoneQuery);

        const items = result.data?.data;

        const mappedItems = await Promise.all(items.map(phone => {
            return this.phoneMappingService.mapUserPhoneToUserPhonePayload(phone);
        }));
        return {items: mappedItems, totalCount: result.totalCount};
    }

    @Post('')
    @AuthorizedResource()
    @HttpCode(201)
    public async insertData(@CurrentUser() user: UserPayload,
                            @Body() data: PhoneHandoverDto): Promise<SimpleRequestPhone> {
        return await this.phoneHandlerService.addPhone(user, data);
    }

    @Post('materials')
    @AuthorizedResource()
    @HttpCode(201)
    public async getMaterials(@CurrentUser() user: UserPayload,
                            @Body() imeis: string[]): Promise<{[material: string]: number}> {
        return await this.phoneModelService.getMaterials(imeis)
    }

    @Get('history/imei')
    @AuthorizedResource()
    public async getHistory(@CurrentUser() user: any, @Query('imei') imei: string): Promise<any> {
        return this.originTrailService.getDataByHistoryImei(imei);
    }

    @Get('history')
    public async getHistoricPhone(@CurrentUser() user: any, @Query('ual') ual: string): Promise<any> {
        return this.originTrailService.getEntityHistoryByUal(ual);
    }

    @Get('updated-allowance')
    public async updatedAllowance() {
        return this.originTrailService.updatedAllowance();
    }

    @Get('statistics')
    public async getStatistics() {
        return this.phoneHandlerService.getStatistics();
    }

    @Get('processed')
    @AuthorizedResource()
    public async getProcessedPhones(@CurrentUser() user: any): Promise<PaginatedResult<UserPhoneSimple>> {
        const result = await this.originTrailService.getDataByDisposalEmail<UserPhoneSimple>(user.email);
        return {items: result.data, totalCount: result.data.length};
    }


    @Get('recycle')
    @AuthorizedResource()
    public async getPhoneByUal(@CurrentUser() user: UserPayload, @Query() query: {ual: string, setState: RecycleState}): Promise<OtPhoneParametersModel> {
        return await this.phoneHandlerService.getPhoneByUalAndSetState(query.ual, user, query.setState);
    }

    // @Post('recycle')
    // @AuthorizedResource()
    // public async processPhoneRetrieval(@Query('ual') ual: string,
    //                                    @Body() phoneDisposableDto: PhoneDisposableDto,
    //                                    @CurrentUser() user: any): Promise<any> {
    //     return await this.originTrailService.addDisposalToThePhone(ual, phoneDisposableDto, user.email);
    // }

    @Get('public')
    getPublic(): string {
        return 'Hello PUBLIC !';
    }

    @Post('state')
    @AuthorizedResource()
    @HttpCode(201)
    public async changeState(@Query('ual') ual: string,
                            @CurrentUser() user: UserPayload,
                            @Body() params: ChangeStateBody): Promise<any> {
        return await this.phoneHandlerService.changeState(ual, user, params);
    }

    @Get('models')
    @AuthorizedResource()
    @HttpCode(201)
    public async getPhones(@CurrentUser() user: any, @Query() query?: { query: string }): Promise<PhonePayload[]> {
        return this.phoneModelService.queryPhoneModels(query.query);
    }

    @Get('check-imei')
    @AuthorizedResource()
    @HttpCode(200)
    public async checkImei(@CurrentUser() user: any, @Query() query?: {imei: string}): Promise<{ isUsed: boolean }> {
        const result = await this.phoneModelService.checkImei(query.imei);
        return result;
    }

    @Get('mock-valuable')
    @HttpCode(200)
    public async mockValuable(): Promise<void> {
        const result = await this.phoneModelService.mockValuable();
    }

    @Get('reveal-nft')
    @HttpCode(200)
    public async revealPhoneNFT(
        @Query('ual') ual: string
    ): Promise<void> {
        await this.phoneHandlerService.revealNftCard(ual);
    }

    @Get('claim-nft')
    @HttpCode(200)
    public async claimPhoneNFT(
        @Query('ual') ual: string
    ): Promise<void> {
        await this.phoneHandlerService.claimNftCard(ual);
    }
}
