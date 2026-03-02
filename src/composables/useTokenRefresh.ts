import { userService } from '@/api/services/UserService';

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let tokenExpiresAt = 0;

function getExpiresIn(token: string): number {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp ? exp * 1000 - Date.now() : 0;
  } catch {
    return 0;
  }
}

export function isTokenExpired(token: string): boolean {
  return getExpiresIn(token) <= 0;
}

function onVisibilityChange(): void {
  if (document.visibilityState !== 'visible') return;
  if (Date.now() >= tokenExpiresAt - 30_000) {
    userService.refreshToken();
  }
}

export function scheduleTokenRefresh(token: string): void {
  clearTimeout(refreshTimer ?? undefined);

  const expiresIn = getExpiresIn(token);
  tokenExpiresAt = Date.now() + expiresIn;

  document.removeEventListener('visibilitychange', onVisibilityChange);
  document.addEventListener('visibilitychange', onVisibilityChange);

  const delay = expiresIn - 30_000;
  if (delay <= 0) return;
  refreshTimer = setTimeout(() => userService.refreshToken(), delay);
}

export function clearTokenRefresh(): void {
  clearTimeout(refreshTimer ?? undefined);
  refreshTimer = null;
  tokenExpiresAt = 0;
  document.removeEventListener('visibilitychange', onVisibilityChange);
}
