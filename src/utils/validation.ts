import { MAX_PLAYERS, MIN_PLAYERS } from '../constants/scoring';

/**
 * Validate player name
 */
export function validatePlayerName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Name must be 30 characters or less' };
  }

  return { valid: true };
}

/**
 * Validate score input (non-negative integer)
 */
export function validateScoreInput(value: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Score must be a whole number' };
  }

  if (value < 0) {
    return { valid: false, error: 'Score cannot be negative' };
  }

  if (value > 999) {
    return { valid: false, error: 'Score seems too high' };
  }

  return { valid: true };
}

/**
 * Validate player count for game
 */
export function validatePlayerCount(count: number): { valid: boolean; error?: string } {
  if (count < MIN_PLAYERS) {
    return { valid: false, error: `Wingspan requires at least ${MIN_PLAYERS} player` };
  }

  if (count > MAX_PLAYERS) {
    return { valid: false, error: `Wingspan supports up to ${MAX_PLAYERS} players` };
  }

  return { valid: true };
}

/**
 * Validate round goal input
 */
export function validateRoundGoalInput(
  value: number,
  mode: 'competitive' | 'casual'
): { valid: boolean; error?: string } {
  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Points must be a whole number' };
  }

  if (value < 0) {
    return { valid: false, error: 'Points cannot be negative' };
  }

  if (mode === 'casual' && value > 5) {
    return { valid: false, error: 'Casual mode max is 5 points per round' };
  }

  if (mode === 'competitive' && value > 5) {
    return { valid: false, error: 'Competitive mode max is 5 points per round' };
  }

  return { valid: true };
}

/**
 * Check if a value is a valid number string
 */
export function isValidNumberString(value: string): boolean {
  if (value === '') return true; // Empty is valid (will be 0)
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 0;
}

/**
 * Parse a score string to number, defaulting to 0
 */
export function parseScoreInput(value: string): number {
  const trimmed = value.trim();
  if (trimmed === '') return 0;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? 0 : Math.max(0, num);
}
