import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserEntity} from './user.entity';
import {PhoneEntity} from './phone.entity';
import {RecycleState} from '../../../../../libs/shared_models/enum/recycleState';

@Entity()
export class UserPhoneEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false, unique: true})
    imei: string

    @Column({nullable: false, default: false})
    isCardClaimed: boolean

    @Column({nullable: false, default: false})
    isCardRevealed: boolean

    @Column({nullable: true})
    ual: string

    @ManyToOne(() => PhoneEntity, (phone) => phone.userPhones, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public phone: PhoneEntity;
    @Column({ nullable: false })
    public phoneId: string;

    @ManyToOne(() => UserEntity, (user) => user.phones, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public user: UserEntity;
    @Column({ nullable: false })
    public userId: string;

    @ManyToOne(() => UserEntity, (user) => user.myPhones, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public handedOverBy: UserEntity;
    @Column({ nullable: true })
    public handedOverById: string;

    @Column({type: 'varchar', nullable: true, })
    public state: RecycleState;
}
