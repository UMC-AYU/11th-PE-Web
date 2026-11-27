// src/auth/jwt-payload.ts
// 토큰 안에 담는 정보입니다. 토큰은 누구나 열어볼 수 있으니 비밀번호 같은 값은 넣지 않습니다.
export type JwtPayload = {
  sub: number; // 회원 ID (JWT 표준 이름 subject)
  email: string;
};
