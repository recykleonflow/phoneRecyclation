import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import {UserPhoneEntity} from './user-phone.entity';
import {MaterialsEntity} from './materials.entity';

@Entity()
export class ConfigurationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false, default: 10})
    maxPointsPerPhone: number;

    @Column({nullable: false, default: 1})
    minPointsPerPhone: number;
}
