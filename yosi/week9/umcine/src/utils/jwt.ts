// JWT의 가운데 부분(payload)은 암호화가 아니라 base64url 인코딩이라 브라우저에서도 읽을 수 있어요.
// 서버가 넣어 둔 sub(회원 ID)를 꺼내서 "내 평점 목록"을 조회할 때 써요.
// 단, 여기서 읽은 값은 화면 표시용이에요. 진짜 권한 확인은 서버가 서명을 검사해서 해요.
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number((JSON.parse(json) as { sub?: unknown }).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
