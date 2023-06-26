import { MigrationInterface, QueryRunner } from "typeorm";

export class historySchema1675935100234 implements MigrationInterface {
    name = 'historySchema1675935100234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD "canSync" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP COLUMN "canSync"`);
    }

}
