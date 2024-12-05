export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export function setChurchId(churchId: number): void {
  localStorage.setItem('churchId', String(churchId));
}

export function getChurchId(): number | null {
  const churchId = localStorage.getItem('churchId');
  return churchId ? Number(churchId) : null;
}

export function removeChurchId(): void {
  localStorage.removeItem('churchId');
}