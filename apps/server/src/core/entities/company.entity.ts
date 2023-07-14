import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from 'typeorm'
import {CompanyType} from '../../../../../libs/shared_models/enum/company-type';
import {UserEntity} from './user.entity';

@Entity()
export class CompanyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    name: string

    @Column({nullable: true})
    latitude: string

    @Column({nullable: true})
    longitude: string

    @Column({type: 'varchar', nullable: false, default: CompanyType.RETAIL})
    type: CompanyType

    @OneToMany(() => UserEntity, (user) => user.company, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public users: UserEntity[];
}
