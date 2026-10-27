// src/database.provider.ts
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2/promise';

// Repository에서 커넥션 풀을 주입받을 때 쓰는 이름표
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    // .env 값으로 MySQL 커넥션 풀을 만들어 등록합니다.
    useFactory: (config: ConfigService) =>
      createPool({
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        user: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
      }),
  },
];
