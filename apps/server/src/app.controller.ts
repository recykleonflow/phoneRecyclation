import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {OriginTrailService} from './origin-trail/service/origin-trail.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly originTrailService: OriginTrailService) {}

  @Get()
  getHello(): any {
    return this.appService.queryPhoneModels('');
  }

  @Get('ot-info')
  getInfo(): any {
    return this.originTrailService.getInfo();
  }
}
