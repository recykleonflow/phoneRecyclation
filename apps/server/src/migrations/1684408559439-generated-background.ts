import { MigrationInterface, QueryRunner } from "typeorm";

export class  GeneratedBackground1684408559439 implements MigrationInterface {
    name = 'GeneratedBackground1684408559439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generated_background_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "prompt" character varying NOT NULL, "url" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cc1c7e412339b303d5b11a46d33" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "generated_background_entity"`);
    }
}