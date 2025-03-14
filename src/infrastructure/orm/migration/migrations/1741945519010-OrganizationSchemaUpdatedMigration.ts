import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationSchemaUpdatedMigration1741945519010 implements MigrationInterface {
    name = 'OrganizationSchemaUpdatedMigration1741945519010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_a879ed0435f36abdefa70062817"`);
        await queryRunner.query(`CREATE TABLE "organization_super_admins_super_admin" ("organizationId" integer NOT NULL, "superAdminId" integer NOT NULL, CONSTRAINT "PK_e7d104e2d10faf58f2c0f5c0912" PRIMARY KEY ("organizationId", "superAdminId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_00066343b86ef0b7a25dc91e75" ON "organization_super_admins_super_admin" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b872dc8bd76fe6321a6afc0cb9" ON "organization_super_admins_super_admin" ("superAdminId") `);
        await queryRunner.query(`CREATE TABLE "super_admin_organizations_organization" ("superAdminId" integer NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "PK_dbf8e3b8e0ffc23c6b84fc80c37" PRIMARY KEY ("superAdminId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a731a76d7a1b5432ff1d83563e" ON "super_admin_organizations_organization" ("superAdminId") `);
        await queryRunner.query(`CREATE INDEX "IDX_927f4203259b65d65bb9a2d602" ON "super_admin_organizations_organization" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "superAdminId"`);
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
        await queryRunner.query(`ALTER TABLE "organization" ADD "superAdminId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_927f4203259b65d65bb9a2d602"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a731a76d7a1b5432ff1d83563e"`);
        await queryRunner.query(`DROP TABLE "super_admin_organizations_organization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b872dc8bd76fe6321a6afc0cb9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00066343b86ef0b7a25dc91e75"`);
        await queryRunner.query(`DROP TABLE "organization_super_admins_super_admin"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_a879ed0435f36abdefa70062817" FOREIGN KEY ("superAdminId") REFERENCES "super_admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
