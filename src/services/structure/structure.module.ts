import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Structure } from './entities/structure.entity';
import { StructureController } from './structure.controller';
import { StructureService } from './structure.service';

@Module({
  imports: [TypeOrmModule.forFeature([Structure])],
  controllers: [StructureController],
  providers: [StructureService],
  exports: [StructureService],
})
export class StructureModule {}
