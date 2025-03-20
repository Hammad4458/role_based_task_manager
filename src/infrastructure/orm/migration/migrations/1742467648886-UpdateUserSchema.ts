import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSchema1742467648886 implements MigrationInterface {
    name = 'UpdateUserSchema1742467648886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
