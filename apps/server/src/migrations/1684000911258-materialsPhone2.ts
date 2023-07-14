import { MigrationInterface, QueryRunner } from "typeorm";

export class MaterialsPhone21684000911258 implements MigrationInterface {
    name = 'MaterialsPhone21684000911258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "plastic"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "plastic" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "glass"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "glass" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "gold"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "gold" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "silver"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "silver" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "paladium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "paladium" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "platinum"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "platinum" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "aluminium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "aluminium" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "copper" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "lithium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "lithium" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "lithium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "lithium" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "copper"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "copper" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "aluminium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "aluminium" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "platinum"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "platinum" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "paladium"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "paladium" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "silver"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "silver" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "gold"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "gold" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "glass"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "glass" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "materials_entity" DROP COLUMN "plastic"`);
        await queryRunner.query(`ALTER TABLE "materials_entity" ADD "plastic" integer NOT NULL DEFAULT '0'`);
    }

}
