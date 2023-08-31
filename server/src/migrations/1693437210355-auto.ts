import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1693437210355 implements MigrationInterface {
    name = 'Auto1693437210355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_1a8d63597eec7a1700a7109c6e8"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "REL_1a8d63597eec7a1700a7109c6e"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "player_id"`);
        await queryRunner.query(`ALTER TABLE "bets" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "bets" ADD "gameId" integer`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_92cef011d2afac3ce58583d6f1a" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_92cef011d2afac3ce58583d6f1a"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "gameId"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "bets" ADD "player_id" integer`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "REL_1a8d63597eec7a1700a7109c6e" UNIQUE ("player_id")`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_1a8d63597eec7a1700a7109c6e8" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
