import {Module} from '@nestjs/common';
import {PhoneController} from './controller/phone/phone.controller';
import {PhoneHandlerService} from './service/phone-handler/phone-handler.service';
import {OriginTrailModule} from '../origin-trail/origin-trail.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {FirebaseModule} from '../firebase/firebase.module';
import {ImageGenerationModule} from 'src/image-generation/image-generation.module';
import {PinataModule} from 'src/pinata/pinata.module';
import {PhoneModelService} from './service/phone-model.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PhoneEntity} from '../core/entities/phone.entity';
import {UserPhoneEntity} from '../core/entities/user-phone.entity';
import {MaterialsEntity} from '../core/entities/materials.entity';
import {AuthorizationModule} from '../authorization/authorization.module';
import { PhoneMappingService } from './service/phone-handler/phone-mapping.service';
import {LiveUpdateService} from './service/phone-handler/live-update.service';

@Module({
    imports: [
        AuthorizationModule,
        OriginTrailModule,
        ImageGenerationModule,
        PinataModule,
        FirebaseModule,
        TypeOrmModule.forFeature([PhoneEntity, UserPhoneEntity, MaterialsEntity]),
        ConfigModule.forRoot({
            isGlobal: true,
        })
    ],
    controllers: [PhoneController],
    providers: [PhoneHandlerService, PhoneModelService, PhoneMappingService, LiveUpdateService]
})
export class PhoneModule {
}
