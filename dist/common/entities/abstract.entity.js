"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEntity = void 0;
const typeorm_1 = require("typeorm");
class AbstractEntity {
    setIsDelete(isDeleted) {
        if (isDeleted == null) {
            isDeleted = false;
        }
        else if (isDeleted && !this.isDeleted) {
            this.deletedDate = new Date();
        }
        this.isDeleted = isDeleted;
    }
}
__decorate([
    (0, typeorm_1.Column)({ default: false, select: false }),
    __metadata("design:type", Boolean)
], AbstractEntity.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "deletedDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "updatedAt", void 0);
exports.AbstractEntity = AbstractEntity;
//# sourceMappingURL=abstract.entity.js.map