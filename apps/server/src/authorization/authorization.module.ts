import { Module } from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {LoggedInGuard} from './guard/logged-in-guard.service';
import {FirebaseModule} from '../firebase/firebase.module';
import {UserController} from './controller/user.controller';
import {UserService} from './service/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from '../core/entities/user.entity';
import {CompanyController} from './controller/company.controller';
import {CompanyService} from './service/company.service';
import {CompanyEntity} from '../core/entities/company.entity';
import {RewardsModule} from '../rewards/rewards.module';

@Module({
    controllers: [UserController, CompanyController],
    imports: [FirebaseModule, RewardsModule, TypeOrmModule.forFeature([UserEntity, CompanyEntity])],
    providers: [
        UserService,
        CompanyService,
        {
        provide: APP_GUARD,
        useClass: LoggedInGuard,
    },],
    exports: [UserService]
})
export class AuthorizationModule {}
