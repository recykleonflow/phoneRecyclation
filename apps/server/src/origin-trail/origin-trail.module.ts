import {Module} from '@nestjs/common';
import {OriginTrailService} from './service/origin-trail.service';
import {OriginTrailController} from './controller/origin-trail/origin-trail.controller';
import {DkgAssertionService} from './service/dkg-assertion.service';
import {AuthorizationModule} from '../authorization/authorization.module';
import { ImageGenerationModule } from 'src/image-generation/image-generation.module';
import { PinataModule } from 'src/pinata/pinata.module';
import { UserPhoneEntity } from 'src/core/entities/user-phone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPhoneEntity]),
    AuthorizationModule,
    ImageGenerationModule,
    PinataModule,
  ],
  providers: [ OriginTrailService, DkgAssertionService],
  exports: [OriginTrailService],
  controllers: [OriginTrailController]
})
export class OriginTrailModule {}
