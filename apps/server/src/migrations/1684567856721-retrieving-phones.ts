import { MigrationInterface, QueryRunner } from "typeorm";

export class RetrievingPhones1684567856721 implements MigrationInterface {
    name = 'RetrievingPhones1684567856721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "handedOverById" uuid`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_b4f0321fb7c9f84fe2122ecf46c" FOREIGN KEY ("handedOverById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_b4f0321fb7c9f84fe2122ecf46c"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "handedOverById"`);
    }

}
