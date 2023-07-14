import { MigrationInterface, QueryRunner } from "typeorm";

export class MaterialsPhone1684000476335 implements MigrationInterface {
    name = 'MaterialsPhone1684000476335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD "materialsId" uuid`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP CONSTRAINT "PK_dac1462995099a6568f1aa348eb"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD CONSTRAINT "PK_dac1462995099a6568f1aa348eb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD CONSTRAINT "FK_f96f278b41ccc319e32b2376157" FOREIGN KEY ("materialsId") REFERENCES "materials_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP CONSTRAINT "FK_f96f278b41ccc319e32b2376157"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP CONSTRAINT "PK_dac1462995099a6568f1aa348eb"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD CONSTRAINT "PK_dac1462995099a6568f1aa348eb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP COLUMN "materialsId"`);
    }

}
