import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserEntity} from './user.entity';
import {PhoneEntity} from './phone.entity';
import { RewardsEntity } from './rewards.entity';

@Entity()
export class UserRewardEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    public code: string;

    @Column({nullable: false})
    public createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.userRewards, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public user: UserEntity;
    @Column({ nullable: false })
    public userId: string;

    @ManyToOne(() => RewardsEntity, (reward) => reward.userRewards, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public reward: RewardsEntity;
    @Column({ nullable: false })
    public rewardId: string;
}
