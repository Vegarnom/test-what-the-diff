export declare class AbstractEntity {
    isDeleted: boolean;
    deletedDate: Date;
    createdAt: Date;
    updatedAt: Date;
    setIsDelete?(isDeleted: boolean): void;
}
