import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions, DataSource } from 'typeorm';
import databaseConfig from './database-config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return databaseConfig;
  },
  dataSourceFactory: async (options: DataSourceOptions) => {
    const dataSource = await new DataSource(options).initialize();
    await dataSource.runMigrations();
    return dataSource;
  },
};
