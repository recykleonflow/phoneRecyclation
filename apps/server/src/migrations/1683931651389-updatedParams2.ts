import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedParams21683931651389 implements MigrationInterface {
    name = 'UpdatedParams21683931651389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "firebaseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_06c9316662b6fbe54e10199bbff" UNIQUE ("firebaseId")`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "UQ_8318c3bbea9acb1c29541727bab" UNIQUE ("imei")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "UQ_8318c3bbea9acb1c29541727bab"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_06c9316662b6fbe54e10199bbff"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "firebaseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "email"`);
    }

}
