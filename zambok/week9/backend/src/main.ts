import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApplication } from "./configure-app";
import { setupSwagger } from "./swagger/setup-swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  setupSwagger(app);
  await app.listen(3000);
}
void bootstrap();
