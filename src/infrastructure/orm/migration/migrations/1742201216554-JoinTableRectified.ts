import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinTableRectified1742201216554 implements MigrationInterface {
    name = 'JoinTableRectified1742201216554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
