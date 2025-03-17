import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedSchema21742195580915 implements MigrationInterface {
    name = 'UpdatedSchema21742195580915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department_organizations_organization" ("departmentId" integer NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "PK_280db02e7e1b206ae647bbb3e3a" PRIMARY KEY ("departmentId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cdbf3e98b1cd1be043f8764aff" ON "department_organizations_organization" ("departmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_34d9d5161e781bc8e36d3ebef6" ON "department_organizations_organization" ("organizationId") `);
        await queryRunner.query(`CREATE TABLE "user_tasks_assigned_task" ("userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_08029aefd363c605a767fe1b188" PRIMARY KEY ("userId", "taskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_107a1aa894251248fc4f3b2725" ON "user_tasks_assigned_task" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d58794bdde70a55c3184e12489" ON "user_tasks_assigned_task" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_cdbf3e98b1cd1be043f8764affe" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tasks_assigned_task" ADD CONSTRAINT "FK_107a1aa894251248fc4f3b2725e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_tasks_assigned_task" ADD CONSTRAINT "FK_d58794bdde70a55c3184e124893" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tasks_assigned_task" DROP CONSTRAINT "FK_d58794bdde70a55c3184e124893"`);
        await queryRunner.query(`ALTER TABLE "user_tasks_assigned_task" DROP CONSTRAINT "FK_107a1aa894251248fc4f3b2725e"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_cdbf3e98b1cd1be043f8764affe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d58794bdde70a55c3184e12489"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_107a1aa894251248fc4f3b2725"`);
        await queryRunner.query(`DROP TABLE "user_tasks_assigned_task"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34d9d5161e781bc8e36d3ebef6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdbf3e98b1cd1be043f8764aff"`);
        await queryRunner.query(`DROP TABLE "department_organizations_organization"`);
    }

}
