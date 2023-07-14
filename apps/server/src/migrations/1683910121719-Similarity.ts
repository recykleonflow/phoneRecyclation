import { MigrationInterface, QueryRunner } from "typeorm"

export class Similarity1683910121719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION pg_trgm;`);
        await queryRunner.query(`CREATE EXTENSION unaccent;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
