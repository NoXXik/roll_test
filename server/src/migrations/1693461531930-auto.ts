import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1693461531930 implements MigrationInterface {
    name = 'Auto1693461531930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" ADD "won" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "won"`);
    }

}
