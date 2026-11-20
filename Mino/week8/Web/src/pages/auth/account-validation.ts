const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidNickname(nickname: string) {
  const length = nickname.trim().length;
  return length >= 2 && length <= 12;
}
