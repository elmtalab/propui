export const BASE_URL = 'https://prop-backend-worker.elmtalabx.workers.dev';

export async function startLogin(telegramId: string, phone: string): Promise<string> {
  const resp = await fetch(`${BASE_URL}/api/avatars/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId, phone }),
  });
  if (!resp.ok) throw new Error('Failed to start login');
  const data = await resp.json();
  return data.loginId as string;
}

export async function verifyLogin(loginId: string, code: string): Promise<string> {
  const resp = await fetch(`${BASE_URL}/api/avatars/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, code }),
  });
  if (!resp.ok) throw new Error('Failed to verify login');
  const data = await resp.json();
  return data.avatarId as string;
}

export async function listAvatars(telegramId: string): Promise<string[]> {
  const resp = await fetch(`${BASE_URL}/api/avatars?telegramId=${encodeURIComponent(telegramId)}`);
  if (!resp.ok) throw new Error('Failed to list avatars');
  const data = await resp.json();
  return data.avatarIds as string[];
}

export async function getAvatar(avatarId: string): Promise<{ telegramId: string }> {
  const resp = await fetch(`${BASE_URL}/api/avatar?avatarId=${encodeURIComponent(avatarId)}`);
  if (!resp.ok) throw new Error('Failed to get avatar');
  const data = await resp.json();
  return { telegramId: data.telegramId as string };
}
