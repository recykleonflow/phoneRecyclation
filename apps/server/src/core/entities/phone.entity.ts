import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserPhoneEntity} from './user-phone.entity';
import {MaterialsEntity} from './materials.entity';

@Entity()
export class PhoneEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    brand: string

    @Column({unique: true, nullable: false})
    model: string

    @Column({nullable: true})
    battery: string;

    @OneToMany(() => UserPhoneEntity, (userPhone) => userPhone.phone, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public userPhones: UserPhoneEntity[];

    @ManyToOne(() => MaterialsEntity, (materials) => materials.phones, {
        cascade: ['insert', 'update'],
    })
    public materials: MaterialsEntity;
}
