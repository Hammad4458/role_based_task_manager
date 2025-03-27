import { MigrationInterface, QueryRunner } from "typeorm";

export class InterfacesApplied1743062523017 implements MigrationInterface {
    name = 'InterfacesApplied1743062523017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_departments_department" ("organizationId" integer NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "PK_797dc762071e22f92c3a6e788fa" PRIMARY KEY ("organizationId", "departmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52635efa09515ed5950679f189" ON "organization_departments_department" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_87a23080e0b842ebccc0f82704" ON "organization_departments_department" ("departmentId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "departmentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" ADD CONSTRAINT "FK_52635efa09515ed5950679f1898" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" ADD CONSTRAINT "FK_87a23080e0b842ebccc0f827045" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_departments_department" DROP CONSTRAINT "FK_87a23080e0b842ebccc0f827045"`);
        await queryRunner.query(`ALTER TABLE "organization_departments_department" DROP CONSTRAINT "FK_52635efa09515ed5950679f1898"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "departmentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87a23080e0b842ebccc0f82704"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52635efa09515ed5950679f189"`);
        await queryRunner.query(`DROP TABLE "organization_departments_department"`);
    }

}
