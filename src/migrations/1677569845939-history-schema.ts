import { MigrationInterface, QueryRunner } from "typeorm";

export class historySchema1677569845939 implements MigrationInterface {
    name = 'historySchema1677569845939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP COLUMN "canSync"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "isAddBySync"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "isConfig"`);
        await queryRunner.query(`ALTER TABLE "brand_device" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "brand_device" ADD "key" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand_device" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "brand_device" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "isConfig" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" ADD "isAddBySync" boolean`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD "canSync" boolean`);
    }

}
