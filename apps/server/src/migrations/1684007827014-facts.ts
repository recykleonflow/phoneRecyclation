import { MigrationInterface, QueryRunner } from "typeorm";

export class Facts1684007827014 implements MigrationInterface {
    name = 'Facts1684007827014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recyclation_fact_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "text" character varying NOT NULL, CONSTRAINT "UQ_15e8e9a5d7a1018066214bff2bf" UNIQUE ("text"), CONSTRAINT "PK_ae9e25423912f8244223f3dfd72" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "recyclation_fact_entity"`);
    }

}
