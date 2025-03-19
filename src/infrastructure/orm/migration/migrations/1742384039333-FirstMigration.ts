import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1742384039333 implements MigrationInterface {
    name = 'FirstMigration1742384039333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "dueDate" date NOT NULL, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'LOW', "status" "public"."task_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" integer NOT NULL, "createdById" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "superAdminId" integer, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "super_admin" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_839275e20f1c82c22b82ea67c75" UNIQUE ("name"), CONSTRAINT "UQ_1ce171ef935f892c7f13004f232" UNIQUE ("email"), CONSTRAINT "PK_3c4fab866f4c62a54ee1ebb1fe3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'MANAGER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "superAdminId" integer, "organizationId" integer, "departmentId" integer, "managerId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_assigned_users_user" ("taskId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_42062be7c481afd8e850318f790" PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b1a0ee8b85e614fe21107e0fb" ON "task_assigned_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_876e3650ef1a751f8e9b88d451" ON "task_assigned_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "department_organizations_organization" ("departmentId" integer NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "PK_280db02e7e1b206ae647bbb3e3a" PRIMARY KEY ("departmentId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cdbf3e98b1cd1be043f8764aff" ON "department_organizations_organization" ("departmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_34d9d5161e781bc8e36d3ebef6" ON "department_organizations_organization" ("organizationId") `);
        await queryRunner.query(`CREATE TABLE "organization_super_admins_super_admin" ("organizationId" integer NOT NULL, "superAdminId" integer NOT NULL, CONSTRAINT "PK_e7d104e2d10faf58f2c0f5c0912" PRIMARY KEY ("organizationId", "superAdminId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_00066343b86ef0b7a25dc91e75" ON "organization_super_admins_super_admin" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b872dc8bd76fe6321a6afc0cb9" ON "organization_super_admins_super_admin" ("superAdminId") `);
        await queryRunner.query(`CREATE TABLE "super_admin_organizations_organization" ("superAdminId" integer NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "PK_dbf8e3b8e0ffc23c6b84fc80c37" PRIMARY KEY ("superAdminId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a731a76d7a1b5432ff1d83563e" ON "super_admin_organizations_organization" ("superAdminId") `);
        await queryRunner.query(`CREATE INDEX "IDX_927f4203259b65d65bb9a2d602" ON "super_admin_organizations_organization" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_60ceedcfccfc655b3f84bae81a8" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_a79485f797e2f72cf4a32fac263" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d33425a4fb8f9004113762e7104" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" ADD CONSTRAINT "FK_1b1a0ee8b85e614fe21107e0fb8" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" ADD CONSTRAINT "FK_876e3650ef1a751f8e9b88d4510" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_cdbf3e98b1cd1be043f8764affe" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" ADD CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_super_admins_super_admin" ADD CONSTRAINT "FK_00066343b86ef0b7a25dc91e754" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_super_admins_super_admin" ADD CONSTRAINT "FK_b872dc8bd76fe6321a6afc0cb9b" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "super_admin_organizations_organization" ADD CONSTRAINT "FK_a731a76d7a1b5432ff1d83563e4" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "super_admin_organizations_organization" ADD CONSTRAINT "FK_927f4203259b65d65bb9a2d6021" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_admin_organizations_organization" DROP CONSTRAINT "FK_927f4203259b65d65bb9a2d6021"`);
        await queryRunner.query(`ALTER TABLE "super_admin_organizations_organization" DROP CONSTRAINT "FK_a731a76d7a1b5432ff1d83563e4"`);
        await queryRunner.query(`ALTER TABLE "organization_super_admins_super_admin" DROP CONSTRAINT "FK_b872dc8bd76fe6321a6afc0cb9b"`);
        await queryRunner.query(`ALTER TABLE "organization_super_admins_super_admin" DROP CONSTRAINT "FK_00066343b86ef0b7a25dc91e754"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_34d9d5161e781bc8e36d3ebef63"`);
        await queryRunner.query(`ALTER TABLE "department_organizations_organization" DROP CONSTRAINT "FK_cdbf3e98b1cd1be043f8764affe"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" DROP CONSTRAINT "FK_876e3650ef1a751f8e9b88d4510"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" DROP CONSTRAINT "FK_1b1a0ee8b85e614fe21107e0fb8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d33425a4fb8f9004113762e7104"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_a79485f797e2f72cf4a32fac263"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_60ceedcfccfc655b3f84bae81a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_927f4203259b65d65bb9a2d602"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a731a76d7a1b5432ff1d83563e"`);
        await queryRunner.query(`DROP TABLE "super_admin_organizations_organization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b872dc8bd76fe6321a6afc0cb9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00066343b86ef0b7a25dc91e75"`);
        await queryRunner.query(`DROP TABLE "organization_super_admins_super_admin"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34d9d5161e781bc8e36d3ebef6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdbf3e98b1cd1be043f8764aff"`);
        await queryRunner.query(`DROP TABLE "department_organizations_organization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_876e3650ef1a751f8e9b88d451"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b1a0ee8b85e614fe21107e0fb"`);
        await queryRunner.query(`DROP TABLE "task_assigned_users_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "super_admin"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
    }

}
