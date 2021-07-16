import 'reflect-metadata';
import {
  DynamicModule,
  ModuleMetadata,
  OnApplicationShutdown,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core/injector/module-ref';
import { Pool, PoolOptions } from 'mysql2/promise';
export declare function helloMsn(): string;
export interface NestMysql2Options extends PoolOptions {}
export interface NestMysql2OptionsFactory {
  createNestMysql2Options(): Promise<NestMysql2Options> | NestMysql2Options;
}
export interface NestMysql2AsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NestMysql2OptionsFactory>;
  useClass?: Type<NestMysql2OptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NestMysql2Options> | NestMysql2Options;
}
export declare class NestMysql2Module implements OnApplicationShutdown {
  private readonly options;
  private readonly pool;
  private readonly moduleRef;
  constructor(options: NestMysql2Options, pool: Pool, moduleRef: ModuleRef);
  static register(options: NestMysql2Options): DynamicModule;
  static registerAsync(options: NestMysql2AsyncOptions): DynamicModule;
  private static createProviders;
  private static createOptionsProvider;
  onApplicationShutdown(): Promise<void>;
}
export { Pool as Mysql };
export declare const InjectMysql: () => (
  target: object,
  key: string | symbol,
  index?: number,
) => void;
