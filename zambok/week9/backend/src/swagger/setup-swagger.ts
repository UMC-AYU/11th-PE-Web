import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("UMCine API")
    .setDescription("회원·JWT 인증·영화 평점·즐겨찾기·영화 기록 API")
    .setVersion("9.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger-ui", app, document, { jsonDocumentUrl: "/swagger-ui-json" });
  return document;
}
