import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRewards1684587905319 implements MigrationInterface {
    name = 'UserRewards1684587905319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_reward_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "rewardId" uuid NOT NULL, CONSTRAINT "PK_5e8d64acea2cda839432357acd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_reward_entity" ADD CONSTRAINT "FK_91e3d571b4b18f385e153f354c2" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_reward_entity" ADD CONSTRAINT "FK_aee0c3ef9676af7046e3af1624b" FOREIGN KEY ("rewardId") REFERENCES "rewards_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_reward_entity" DROP CONSTRAINT "FK_aee0c3ef9676af7046e3af1624b"`);
        await queryRunner.query(`ALTER TABLE "user_reward_entity" DROP CONSTRAINT "FK_91e3d571b4b18f385e153f354c2"`);
        await queryRunner.query(`DROP TABLE "user_reward_entity"`);
    }
}