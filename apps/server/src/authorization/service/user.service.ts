import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {UserEntity} from '../../core/entities/user.entity';
import {UserRole} from '../../../../../libs/shared_models/enum/user-role';
import {Observable} from 'rxjs';
import {UserPayload} from '../../../../../libs/shared_models/model/user-payload.model';
import {plainToInstance} from 'class-transformer';
import {PhoneEntity} from '../../core/entities/phone.entity';
import {RewardsService} from '../../rewards/service/rewards.service';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
                private readonly userEntityRepository: Repository<UserEntity>,
                private readonly rewardsService: RewardsService) {
    }

    public async updateUser(user: UserEntity): Promise<void> {
        await this.userEntityRepository.save(user);
    }

    public async addPoints(phoneEntity: PhoneEntity, userId: string): Promise<void> {
        const points = await this.rewardsService.calculatePoints(phoneEntity);
        const user = await this.getUserById(userId);
        user.balance = user.balance + points;
        await this.userEntityRepository.save(user);
    }

    getUserById(id: string): Promise<UserEntity> {
        return this.userEntityRepository.findOne({where: {id}, relations: ['company']});
    }

    getUserByFirebaseId(firebaseId: string): Promise<UserEntity> {
        return this.userEntityRepository.findOne({where: {firebaseId}, relations: ['company']});
    }

    createDbUser(firebaseId: string, email: string, phoneNumber?: string): Promise<UserEntity> {
        return this.userEntityRepository.save(this.userEntityRepository.create({firebaseId, role: UserRole.CLIENT, email, phoneNumber}));
    }

    public async createOrUpdateDbUserWithFirebase(firebaseId: string, email: string): Promise<UserEntity> {
        const user = await this.getUserByEmailPlain(email);
        if (user) {
            user.firebaseId = firebaseId;
            return this.userEntityRepository.save(user);
        } else {
            return await this.createDbUser(firebaseId, email);
        }
    }

    public async getUsersByEmail(email: string): Promise<UserPayload[]> {

        const users = await this.userEntityRepository.find({
            where: {email: ILike(`%${email}%`)},
            relations: ['company']}
        );
        return plainToInstance(UserPayload, users);
    }

    public async getUserByEmailPlain(email: string): Promise<UserEntity> {

        const user = await this.userEntityRepository.findOne({
            where: {email},
            relations: ['company']}
        );
        return user;
    }

    public async getUserEntityByEmail(email: string): Promise<UserEntity> {
        return await this.getUserByEmailPlain(email);
    }

    public async getUserByEmail(email: string): Promise<UserPayload> {

        const user = await this.getUserByEmailPlain(email);
        return plainToInstance(UserPayload, user);
    }
}
