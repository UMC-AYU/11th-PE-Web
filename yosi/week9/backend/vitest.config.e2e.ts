import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// 통합 테스트: test 안의 *.e2e-spec.ts (컨트롤러·인증·검증·DB까지 실제로 실행)
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    include: ['test/**/*.e2e-spec.ts'],
    // 실제 DB를 쓰니까 테스트 파일끼리 동시에 돌지 않게 해요.
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
});
