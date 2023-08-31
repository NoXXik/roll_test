import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1693437671417 implements MigrationInterface {
    name = 'Auto1693437671417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_5f2d39b49ade7e54364af8350e9"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "game_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" ADD "game_id" integer`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_5f2d39b49ade7e54364af8350e9" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
