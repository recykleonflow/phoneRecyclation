import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserPhoneEntity} from './user-phone.entity';
import {MaterialsEntity} from './materials.entity';

@Entity()
export class RecyclationFactEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    country: string

    @Column({unique: true, nullable: false})
    text: string
}
