import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import { UserRewardEntity } from "./user-reward.entity";

@Entity()
export class RewardsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    cost: number;

    @Column({nullable: false})
    description: string

    @Column({nullable: false})
    shortName: string

    @Column({nullable: false})
    pictureUrl: string

    @OneToMany(() => UserRewardEntity, (userReward) => userReward.reward, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public userRewards: UserRewardEntity[];
}
