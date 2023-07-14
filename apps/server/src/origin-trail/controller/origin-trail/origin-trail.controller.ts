import {Body, Controller, Get, HttpCode, Param, Post, Query} from '@nestjs/common';
import {OriginTrailService} from '../../service/origin-trail.service';

@Controller('origin-trail')
export class OriginTrailController {
    constructor(private originTrailService: OriginTrailService) {
    }

    @Get('status')
    public getNodeStatus() {
        return this.originTrailService.getInfo()
    }

    @Get('')
    public getData(@Query('ual') ual: string, @Query('id') id: string, @Query('imei') imei: string) {
        if (ual) {
            return this.originTrailService.getEntityByUal(ual)
        } else if (id) {
            return this.originTrailService.getDataById(id)
        } else if (imei) {
            return this.originTrailService.getDataByImei(imei)
        }
    }

    @Post('query')
    public queryData(@Body() query: string) {
        return this.originTrailService.queryData(query);
    }

    @Get('email')
    public getByEmail(@Query('email') email: string): Promise<any> {
        return this.originTrailService.getDataByUser(email);
    }
}
