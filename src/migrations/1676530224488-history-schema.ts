import { MigrationInterface, QueryRunner } from "typeorm";

export class historySchema1676530224488 implements MigrationInterface {
    name = 'historySchema1676530224488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "isAddBySync" boolean`);
        await queryRunner.query(`ALTER TABLE "brand_device" ALTER COLUMN "canSync" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand_device" ALTER COLUMN "canSync" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "isAddBySync"`);
    }

}
