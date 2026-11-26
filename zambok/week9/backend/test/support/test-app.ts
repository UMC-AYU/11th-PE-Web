import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ApiModule } from "../../src/api.module";
import { configureApplication } from "../../src/configure-app";
import { setupSwagger } from "../../src/swagger/setup-swagger";
import { Member } from "../../src/entity/member.entity";
import { Rating } from "../../src/entity/rating.entity";
import { Favorite } from "../../src/entity/favorite.entity";

export async function createTestApp() {
  let app: INestApplication | undefined;
  try {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ type: "sqljs", autoSave: false, synchronize: true, entities: [Member, Rating, Favorite], logging: false }),
        JwtModule.register({ global: true, secret: "week9-in-memory-tests-only-secret", signOptions: { algorithm: "HS256", expiresIn: 3600 }, verifyOptions: { algorithms: ["HS256"] } }),
        ApiModule,
      ],
    }).compile();
    app = module.createNestApplication();
    configureApplication(app);
    setupSwagger(app);
    await app.init();
    const dataSource = app.get(DataSource);
    const members = dataSource.getRepository(Member);
    const member = await members.save(members.create({ email: "test@example.com", nickname: "테스트회원", password: "test-only-not-a-real-password" }));
    const token = await app.get(JwtService).signAsync({ sub: member.memberId });
    const readyApp = app;
    return { app: readyApp, dataSource, member, token, async close() {
      await readyApp.close();
    } };
  } catch (error) {
    await app?.close();
    throw error;
  }
}

export type TestApp = Awaited<ReturnType<typeof createTestApp>>;
