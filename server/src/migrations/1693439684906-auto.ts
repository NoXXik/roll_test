import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1693439684906 implements MigrationInterface {
    name = 'Auto1693439684906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "REL_9f2b915dc5fe607b50b1aca5d4"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d" FOREIGN KEY ("win_player") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "REL_9f2b915dc5fe607b50b1aca5d4" UNIQUE ("win_player")`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_9f2b915dc5fe607b50b1aca5d4d" FOREIGN KEY ("win_player") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
