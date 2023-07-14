import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhoneEntity1683892205236 implements MigrationInterface {
    name = 'CreatePhoneEntity1683892205236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "phone_entity" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, "model" character varying NOT NULL, CONSTRAINT "UQ_34e8a585c1cf003086e7fd49964" UNIQUE ("model"), CONSTRAINT "PK_e164e4e10f0d3b989314c89af8a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "phone_entity"`);
    }

}
