import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1693401683086 implements MigrationInterface {
    name = 'Auto1693401683086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "steam_id" character varying, "nickname" character varying NOT NULL, "password_hash" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', "ban" boolean NOT NULL DEFAULT false, "hashed_refresh" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "bets_amount" integer NOT NULL, "won" integer NOT NULL, "hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "win_player" integer, CONSTRAINT "REL_9f2b915dc5fe607b50b1aca5d4" UNIQUE ("win_player"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bets" ("id" SERIAL NOT NULL, "bet_amount" integer NOT NULL, "bet_time" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "game_id" integer, "player_id" integer, CONSTRAINT "REL_1a8d63597eec7a1700a7109c6e" UNIQUE ("player_id"), CONSTRAINT "PK_7ca91a6a39623bd5c21722bcedd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d" FOREIGN KEY ("win_player") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_5f2d39b49ade7e54364af8350e9" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_1a8d63597eec7a1700a7109c6e8" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_1a8d63597eec7a1700a7109c6e8"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_5f2d39b49ade7e54364af8350e9"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d"`);
        await queryRunner.query(`DROP TABLE "bets"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
