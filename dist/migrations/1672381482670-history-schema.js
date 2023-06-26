"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema1672381482670 = void 0;
class historySchema1672381482670 {
    constructor() {
        this.name = 'historySchema1672381482670';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP CONSTRAINT "PK_0c02e2bb2d889d83de418e1d547"`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD CONSTRAINT "PK_242a36c1022d9a2753cdcd0f26e" PRIMARY KEY ("brandDeviceId", "id")`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP CONSTRAINT "PK_242a36c1022d9a2753cdcd0f26e"`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD CONSTRAINT "PK_33be5af283e9c9016b5f2a3666d" PRIMARY KEY ("id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP CONSTRAINT "PK_33be5af283e9c9016b5f2a3666d"`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD CONSTRAINT "PK_242a36c1022d9a2753cdcd0f26e" PRIMARY KEY ("brandDeviceId", "id")`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" DROP CONSTRAINT "PK_242a36c1022d9a2753cdcd0f26e"`);
        await queryRunner.query(`ALTER TABLE "type_brand_device" ADD CONSTRAINT "PK_0c02e2bb2d889d83de418e1d547" PRIMARY KEY ("typeDeviceId", "brandDeviceId", "id")`);
    }
}
exports.historySchema1672381482670 = historySchema1672381482670;
//# sourceMappingURL=1672381482670-history-schema.js.map