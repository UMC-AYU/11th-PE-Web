// src/app.setup.ts
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filter/http-exception.filter.js';
import { createValidationPipe } from './common/validation.js';

// main.ts와 통합 테스트가 똑같은 설정으로 앱을 띄우도록 한곳에 모읍니다.
// (테스트만 다른 설정으로 돌면 "테스트는 통과했는데 실제 서버는 실패"하는 일이 생깁니다.)
export function configureApp(app: INestApplication) {
  // 전역 ValidationPipe: DTO 검증에 실패하면 필드별 실패 이유를 result에 담아 400으로 응답합니다.
  app.useGlobalPipes(createValidationPipe());

  // 전역 예외 필터: 모든 실패 응답을 { isSuccess: false, code, message, result } 형식으로 맞춥니다.
  app.useGlobalFilters(new HttpExceptionFilter());
}

// [실습 1] Swagger 문서를 /swagger-ui 에 엽니다.
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('UMCine API')
    .setDescription(
      [
        '영화 평점·즐겨찾기 서비스 API 문서입니다.',
        '',
        '- 모든 응답은 `{ isSuccess, code, message, result }` 형식입니다.',
        '- 🔒 자물쇠가 붙은 API는 로그인이 필요합니다. 오른쪽 위 **Authorize** 에 `POST /auth/login` 으로 받은 accessToken 을 넣으세요.',
      ].join('\n'),
    )
    .setVersion('9.0')
    // Authorization: Bearer {token} 헤더를 쓰는 API에 자물쇠를 붙일 수 있게 등록합니다.
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document, {
    // 새로고침해도 Authorize에 넣은 토큰을 유지합니다.
    swaggerOptions: { persistAuthorization: true },
  });
}
