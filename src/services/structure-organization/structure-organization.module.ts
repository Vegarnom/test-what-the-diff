import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructureModule } from '../structure/structure.module';
import { StructureOrganization } from './entities/structure-organization.entity';
import { StructureOrganizationController } from './structure-organization.controller';
import { StructureOrganizationService } from './structure-organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([StructureOrganization]), StructureModule],
  controllers: [StructureOrganizationController],
  providers: [StructureOrganizationService],
})
export class StructureOrganizationModule {}
