import { MigrationInterface, QueryRunner } from "typeorm";

export class State1684612261956 implements MigrationInterface {
    name = 'State1684612261956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "state" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "state"`);
    }

}
