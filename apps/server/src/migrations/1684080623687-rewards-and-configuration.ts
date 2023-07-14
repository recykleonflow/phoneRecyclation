import { MigrationInterface, QueryRunner } from "typeorm";

export class RewardsAndConfiguration1684080623687 implements MigrationInterface {
    name = 'RewardsAndConfiguration1684080623687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rewards_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cost" integer NOT NULL, "description" character varying NOT NULL, "shortName" character varying NOT NULL, "pictureUrl" character varying NOT NULL, CONSTRAINT "PK_1e35c13a98af16d8a2f5c65a4c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "configuration_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "maxPointsPerPhone" integer NOT NULL DEFAULT '10', "minPointsPerPhone" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_efd70a23936bf04f669e7e1df99" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "configuration_entity"`);
        await queryRunner.query(`DROP TABLE "rewards_entity"`);
    }

}
