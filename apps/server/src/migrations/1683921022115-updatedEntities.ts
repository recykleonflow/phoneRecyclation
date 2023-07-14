import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedEntities1683921022115 implements MigrationInterface {
    name = 'UpdatedEntities1683921022115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_5cfa371aa5ab9f1f7817cd49a79"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "userFirebaseId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_06c9316662b6fbe54e10199bbff" PRIMARY KEY ("firebaseId")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_06c9316662b6fbe54e10199bbff"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f" PRIMARY KEY ("firebaseId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "firebaseId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "firebaseId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_846e942963a8de57d1dde8a62d3"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "PK_a7e918b078e1b9a02c9eb0bf794"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "PK_a7e918b078e1b9a02c9eb0bf794" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "phoneId"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "phoneId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP CONSTRAINT "PK_e164e4e10f0d3b989314c89af8a"`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD CONSTRAINT "PK_e164e4e10f0d3b989314c89af8a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "brand_entity" DROP CONSTRAINT "PK_e1bffaa53eebf883232cb6dfb86"`);
        await queryRunner.query(`ALTER TABLE "brand_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "brand_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "brand_entity" ADD CONSTRAINT "PK_e1bffaa53eebf883232cb6dfb86" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_846e942963a8de57d1dde8a62d3" FOREIGN KEY ("phoneId") REFERENCES "phone_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_d34a736049573f45f31efda3810" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_d34a736049573f45f31efda3810"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_846e942963a8de57d1dde8a62d3"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4"`);
        await queryRunner.query(`ALTER TABLE "brand_entity" DROP CONSTRAINT "PK_e1bffaa53eebf883232cb6dfb86"`);
        await queryRunner.query(`ALTER TABLE "brand_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "brand_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brand_entity" ADD CONSTRAINT "PK_e1bffaa53eebf883232cb6dfb86" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP CONSTRAINT "PK_e164e4e10f0d3b989314c89af8a"`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD CONSTRAINT "PK_e164e4e10f0d3b989314c89af8a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "phoneId"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "phoneId" integer`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "PK_a7e918b078e1b9a02c9eb0bf794"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "PK_a7e918b078e1b9a02c9eb0bf794" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_846e942963a8de57d1dde8a62d3" FOREIGN KEY ("phoneId") REFERENCES "phone_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "firebaseId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "firebaseId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_b54f8ea623b17094db7667d8206"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f" PRIMARY KEY ("firebaseId", "id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_06c9316662b6fbe54e10199bbff" PRIMARY KEY ("firebaseId")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_06c9316662b6fbe54e10199bbff"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f" PRIMARY KEY ("id", "firebaseId")`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a"`);
        await queryRunner.query(`ALTER TABLE "company_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_entity" ADD CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD "userFirebaseId" integer`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_5cfa371aa5ab9f1f7817cd49a79" FOREIGN KEY ("userId", "userFirebaseId") REFERENCES "user_entity"("id","firebaseId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
