import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class GeneratedBackgroundEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    prompt: string;

    @Column({nullable: false})
    url: string;

    @Column({nullable: false, default: false})
    used: boolean;
}
