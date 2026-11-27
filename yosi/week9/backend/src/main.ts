// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp, setupSwagger } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: 브라우저는 다른 출처(origin)의 서버 응답을 기본적으로 막습니다.
  // 프론트(localhost:5173)에서 이 서버(localhost:8080)를 호출할 수 있도록 허용할 출처만 지정합니다.
  // .env의 CORS_ENABLED=false로 끄면 CORS 설정 전 상태(콘솔에 CORS 에러)를 확인할 수 있습니다.
  if (process.env.CORS_ENABLED !== 'false') {
    const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim());
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    });
  }

  // 검증 파이프와 예외 필터 (통합 테스트와 같은 설정을 씁니다.)
  configureApp(app);

  // Swagger 문서: http://localhost:8080/swagger-ui
  setupSwagger(app);

  // 프론트 Vite(5173), 디자인 기준 프론트(3000)와 겹치지 않게 8080 포트를 사용합니다.
  await app.listen(process.env.PORT ?? 8080);
}
await bootstrap();
