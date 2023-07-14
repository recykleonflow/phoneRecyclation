import { MigrationInterface, QueryRunner } from "typeorm";

export class DbSchema1683905139111 implements MigrationInterface {
    name = 'DbSchema1683905139111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_phone_entity" ("id" SERIAL NOT NULL, "isCardClaimed" boolean NOT NULL DEFAULT false, "isCardRevealed" boolean NOT NULL DEFAULT false, "ual" boolean, "phoneId" integer, "userId" integer, "userFirebaseId" integer, CONSTRAINT "PK_a7e918b078e1b9a02c9eb0bf794" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "firebaseId" SERIAL NOT NULL, "role" character varying NOT NULL DEFAULT 'CLIENT', "balance" integer NOT NULL DEFAULT '0', "companyId" integer, CONSTRAINT "PK_13b2d6afef48dadea7e43833b9f" PRIMARY KEY ("id", "firebaseId"))`);
        await queryRunner.query(`CREATE TABLE "company_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "latitude" character varying, "longitude" character varying, "type" character varying NOT NULL DEFAULT 'RETAIL', CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "materials_entity" ("id" SERIAL NOT NULL, "plastic" integer NOT NULL DEFAULT '0', "glass" integer NOT NULL DEFAULT '0', "gold" integer NOT NULL DEFAULT '0', "silver" integer NOT NULL DEFAULT '0', "paladium" integer NOT NULL DEFAULT '0', "platinum" integer NOT NULL DEFAULT '0', "aluminium" integer NOT NULL DEFAULT '0', "copper" integer NOT NULL DEFAULT '0', "lithium" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_dac1462995099a6568f1aa348eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cost" integer NOT NULL, "description" character varying NOT NULL, "shortName" character varying NOT NULL, "pictureUrl" character varying NOT NULL, CONSTRAINT "PK_e1bffaa53eebf883232cb6dfb86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "phone_entity" ADD "battery" character varying`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_846e942963a8de57d1dde8a62d3" FOREIGN KEY ("phoneId") REFERENCES "phone_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" ADD CONSTRAINT "FK_5cfa371aa5ab9f1f7817cd49a79" FOREIGN KEY ("userId", "userFirebaseId") REFERENCES "user_entity"("id","firebaseId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_5cfa371aa5ab9f1f7817cd49a79"`);
        await queryRunner.query(`ALTER TABLE "user_phone_entity" DROP CONSTRAINT "FK_846e942963a8de57d1dde8a62d3"`);
        await queryRunner.query(`ALTER TABLE "phone_entity" DROP COLUMN "battery"`);
        await queryRunner.query(`DROP TABLE "brand_entity"`);
        await queryRunner.query(`DROP TABLE "materials_entity"`);
        await queryRunner.query(`DROP TABLE "company_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "user_phone_entity"`);
    }

}
