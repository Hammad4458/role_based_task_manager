import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTaskUser1742286284412 implements MigrationInterface {
    name = 'UpdatedTaskUser1742286284412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "departmentId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD "adminId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD "managerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "managerId" integer`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "organizationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_60ceedcfccfc655b3f84bae81a8" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_eab1ba6f3cd2f375d4d19dd59ee" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_2b8c3133172a8004844ebd0b1a3" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_2b8c3133172a8004844ebd0b1a3"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_eab1ba6f3cd2f375d4d19dd59ee"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_60ceedcfccfc655b3f84bae81a8"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "organizationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "adminId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
