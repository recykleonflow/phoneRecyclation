import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {OriginTrailModule} from './origin-trail/origin-trail.module';
import {AuthorizationModule} from './authorization/authorization.module';
import {PreauthMiddleware} from './authorization/preauth/preauth.middleware';
import {PhoneModule} from './phone/phone.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {FormattingInterceptor} from './app/interceptor/formatting.interceptor';
import {APP_INTERCEPTOR, ApplicationConfig} from '@nestjs/core';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {FirebaseModule} from './firebase/firebase.module';
import {ImageGenerationModule} from './image-generation/image-generation.module';
import { PinataModule } from './pinata/pinata.module';
import {ConnectionOptions} from 'typeorm';
import {TypeOrmModule} from '@nestjs/typeorm';
import {options} from './core/db/db-options';
import {PhoneEntity} from './core/entities/phone.entity';
import {FactController} from './app/controller/fact.controller';
import {FactService} from './app/service/fact.service';
import {RecyclationFactEntity} from './core/entities/recyclation-fact.entity';
import {RewardsModule} from './rewards/rewards.module';

@Module({

    imports: [
        TypeOrmModule.forFeature([PhoneEntity, RecyclationFactEntity]),
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal: true
        }),
        TypeOrmModule.forRoot(options),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
            exclude: ['/api*']
        }),
        FirebaseModule,
        OriginTrailModule,
        AuthorizationModule,
        PhoneModule,
        ImageGenerationModule,
        PinataModule,
        RewardsModule
    ],
    controllers: [AppController, FactController],
    providers: [AppService,
        FactService,
        {
            provide: APP_INTERCEPTOR,
            useClass: FormattingInterceptor,
        },],
})
export class AppModule implements NestModule {
    constructor() {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(PreauthMiddleware).forRoutes({
            path: '*', method: RequestMethod.ALL
        });
    }
}
