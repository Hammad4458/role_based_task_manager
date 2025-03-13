import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1741862842139 implements MigrationInterface {
    name = 'FirstMigration1741862842139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "superAdminId" uuid, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "superAdminId" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "super_admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_3c4fab866f4c62a54ee1ebb1fe3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'MANAGER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "superAdminId" uuid, "organizationId" uuid NOT NULL, "departmentId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "dueDate" date NOT NULL, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'LOW', "status" "public"."task_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization_departments_department" ("organizationId" uuid NOT NULL, "departmentId" uuid NOT NULL, CONSTRAINT "PK_797dc762071e22f92c3a6e788fa" PRIMARY KEY ("organizationId", "departmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52635efa09515ed5950679f189" ON "organization_departments_department" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_87a23080e0b842ebccc0f82704" ON "organization_departments_department" ("departmentId") `);
        await queryRunner.query(`CREATE TABLE "task_assigned_users_user" ("taskId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_42062be7c481afd8e850318f790" PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b1a0ee8b85e614fe21107e0fb" ON "task_assigned_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_876e3650ef1a751f8e9b88d451" ON "task_assigned_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_a79485f797e2f72cf4a32fac263" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_a879ed0435f36abdefa70062817" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d33425a4fb8f9004113762e7104" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" ADD CONSTRAINT "FK_52635efa09515ed5950679f1898" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" ADD CONSTRAINT "FK_87a23080e0b842ebccc0f827045" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" ADD CONSTRAINT "FK_1b1a0ee8b85e614fe21107e0fb8" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" ADD CONSTRAINT "FK_876e3650ef1a751f8e9b88d4510" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" DROP CONSTRAINT "FK_876e3650ef1a751f8e9b88d4510"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users_user" DROP CONSTRAINT "FK_1b1a0ee8b85e614fe21107e0fb8"`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" DROP CONSTRAINT "FK_87a23080e0b842ebccc0f827045"`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" DROP CONSTRAINT "FK_52635efa09515ed5950679f1898"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d33425a4fb8f9004113762e7104"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_a879ed0435f36abdefa70062817"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_a79485f797e2f72cf4a32fac263"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_876e3650ef1a751f8e9b88d451"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b1a0ee8b85e614fe21107e0fb"`);
        await queryRunner.query(`DROP TABLE "task_assigned_users_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87a23080e0b842ebccc0f82704"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52635efa09515ed5950679f189"`);
        await queryRunner.query(`DROP TABLE "organization_departments_department"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "super_admin"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "department"`);
    }

}
