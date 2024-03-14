export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // 필요한 비밀번호 유효성 규칙을 여기에 추가
  return password.length >= 6; // 예시: 최소 6자 이상의 비밀번호
}
