import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedParams1683925587601 implements MigrationInterface {
    name = 'UpdatedParams1683925587601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "imei" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_846e942963a8de57d1dde8a62d3"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_d34a736049573f45f31efda3810"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "ual"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "ual" character varying`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ALTER COLUMN "phoneId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_846e942963a8de57d1dde8a62d3" FOREIGN KEY ("phoneId") REFERENCES "phone_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_d34a736049573f45f31efda3810" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_d34a736049573f45f31efda3810"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_846e942963a8de57d1dde8a62d3"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ALTER COLUMN "phoneId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "ual"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "ual" boolean`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_d34a736049573f45f31efda3810" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_846e942963a8de57d1dde8a62d3" FOREIGN KEY ("phoneId") REFERENCES "phone_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "imei"`);
    }

}
