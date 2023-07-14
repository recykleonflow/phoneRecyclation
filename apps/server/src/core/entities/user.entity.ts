import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserRole} from '../../../../../libs/shared_models/enum/user-role';
import {CompanyEntity} from './company.entity';
import {PhoneEntity} from './phone.entity';
import {UserPhoneEntity} from './user-phone.entity';
import { UserRewardEntity } from './user-reward.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true, unique: true})
    firebaseId: string

    @Column({nullable: true, unique: true})
    email: string

    @Column({nullable: true})
    phoneNumber: string

    @Column({type: 'varchar', nullable: false, default: UserRole.CLIENT})
    role: UserRole

    @Column({nullable: false, default: 0})
    balance: number

    @ManyToOne(() => CompanyEntity, (company) => company.users, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public company: CompanyEntity;

    @OneToMany(() => UserPhoneEntity, (phone) => phone.user, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public phones: PhoneEntity[];

    @OneToMany(() => UserPhoneEntity, (phone) => phone.handedOverBy, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public myPhones: PhoneEntity[];

    @OneToMany(() => UserRewardEntity, (userReward) => userReward.user, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public userRewards: UserRewardEntity[];
}
