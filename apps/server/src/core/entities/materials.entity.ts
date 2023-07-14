import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import {PhoneEntity} from './phone.entity';

@Entity()
export class MaterialsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'float', nullable: false, default: 0})
    plastic: number

    @Column({type: 'float', nullable: false, default: 0})
    glass: number

    @Column({type: 'float', nullable: false, default: 0})
    gold: number

    @Column({type: 'float', nullable: false, default: 0})
    silver: number

    @Column({type: 'float', nullable: false, default: 0})
    paladium: number

    @Column({type: 'float', nullable: false, default: 0})
    platinum: number

    @Column({type: 'float', nullable: false, default: 0})
    aluminium: number;

    @Column({type: 'float', nullable: false, default: 0})
    copper: number;

    @Column({type: 'float', nullable: false, default: 0})
    lithium: number;

    @OneToMany(() => PhoneEntity, (phone) => phone.materials, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    public phones: PhoneEntity[];
    // constructor(id: string, plastic: number, glass: number, gold: number,
    //             aluminium: number, copper: number, lithium: number) {
    //     this.id = id;
    //     this.plastic = plastic;
    //     this.glass = glass;
    //     this.gold = gold;
    //     this.aluminium = aluminium;
    //     this.copper = copper;
    //     this.lithium = lithium;
    // }
}
