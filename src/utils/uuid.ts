import * as Crypto from 'expo-crypto';

/**
 * Generate a new UUID v4
 */
export function generateUUID(): string {
  return Crypto.randomUUID();
}
