// src/database.module.ts
import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider.js';

// Raw SQL 커넥션 풀(DATABASE_CONNECTION)을 모든 모듈에서 주입받을 수 있게 전역으로 등록합니다.
// 아직 Raw SQL을 쓰는 Repository(대여 등)가 사용합니다.
@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
