"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const database_config_1 = require("./database-config");
exports.AppDataSource = new typeorm_1.DataSource(database_config_1.default);
//# sourceMappingURL=datasource.js.map