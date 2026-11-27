import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// 단위 테스트: src 안의 *.spec.ts (DB 없이 Mock으로 서비스 판단만 확인)
export default defineConfig({
  // NestJS는 데코레이터 정보(emitDecoratorMetadata)로 의존성을 주입해요.
  // Vitest 기본 변환기(esbuild)는 이 정보를 만들지 못해서 SWC로 변환해요.
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
  },
});
