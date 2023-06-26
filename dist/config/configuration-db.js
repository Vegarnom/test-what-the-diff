"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmAsyncConfig = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const database_config_1 = require("./database-config");
exports.typeOrmAsyncConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async () => {
        return database_config_1.default;
    },
    dataSourceFactory: async (options) => {
        const dataSource = await new typeorm_1.DataSource(options).initialize();
        await dataSource.runMigrations();
        return dataSource;
    },
};
//# sourceMappingURL=configuration-db.js.map