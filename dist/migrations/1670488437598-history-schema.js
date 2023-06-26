"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema1670488437598 = void 0;
class historySchema1670488437598 {
    constructor() {
        this.name = 'historySchema1670488437598';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "authorization_kiosk" ("isDeleted" boolean NOT NULL DEFAULT false, "deletedDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "organizationId" integer NOT NULL, "apiKey" character varying, "apiKeyHash" character varying, "thirdPartyId" integer NOT NULL, "token" character varying NOT NULL, "ip" character varying NOT NULL, "deviceId" character varying, CONSTRAINT "PK_6b27b3e879abe043acfdb94f100" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "authorization_kiosk"`);
    }
}
exports.historySchema1670488437598 = historySchema1670488437598;
//# sourceMappingURL=1670488437598-history-schema.js.map