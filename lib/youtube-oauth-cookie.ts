import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'crypto';

export const YOUTUBE_TOKEN_COOKIE = 'sunset_deck_youtube_token';
export const YOUTUBE_STATE_COOKIE = 'sunset_deck_youtube_state';

function key() {
  const secret = process.env.YOUTUBE_TOKEN_ENCRYPTION_KEY?.trim();
  if (!secret) throw new Error('YOUTUBE_TOKEN_ENCRYPTION_KEY is not configured.');
  return createHash('sha256').update(secret).digest();
}

export function encryptRefreshToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptRefreshToken(value?: string) {
  if (!value) return null;
  try {
    const payload = Buffer.from(value, 'base64url');
    const iv = payload.subarray(0, 12);
    const tag = payload.subarray(12, 28);
    const encrypted = payload.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export function createOAuthState() {
  return randomBytes(24).toString('base64url');
}

export function stateMatches(expected?: string, received?: string) {
  if (!expected || !received) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  return left.length === right.length && timingSafeEqual(left, right);
}
