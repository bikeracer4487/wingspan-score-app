/**
 * Format a timestamp for display
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a timestamp with time
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return 'just now';
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (days === 1) {
    return 'yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  if (weeks === 1) {
    return 'last week';
  }

  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }

  if (months === 1) {
    return 'last month';
  }

  if (months < 12) {
    return `${months} months ago`;
  }

  return formatDate(timestamp);
}

/**
 * Get current timestamp
 */
export function now(): number {
  return Date.now();
}
