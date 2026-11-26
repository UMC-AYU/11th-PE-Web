import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { HttpExceptionFilter } from "./filter/http-exception.filter";

export function configureApplication(app: INestApplication) {
  app.enableCors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
}
