"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema1673434603996 = void 0;
class historySchema1673434603996 {
    constructor() {
        this.name = 'historySchema1673434603996';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "third_party" ADD "authorizationType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ADD "refreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ADD "expireToken" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ALTER COLUMN "token" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" ALTER COLUMN "token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" DROP COLUMN "expireToken"`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "authorization_kiosk" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "third_party" DROP COLUMN "authorizationType"`);
    }
}
exports.historySchema1673434603996 = historySchema1673434603996;
//# sourceMappingURL=1673434603996-history-schema.js.map