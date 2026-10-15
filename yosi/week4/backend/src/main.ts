import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 전역 ValidationPipe: DTO에 붙인 검증 데코레이터를 모든 요청에 적용합니다.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 제거
      transform: true, // 요청 JSON을 DTO 클래스로 변환 (@Type(() => Number) 적용)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
