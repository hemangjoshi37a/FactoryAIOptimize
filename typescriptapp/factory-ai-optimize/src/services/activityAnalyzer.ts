export function calculateActivityLevel(objectCount: number): number {
    // Normalize activity level between 0-1
    if (objectCount === 0) return 0;
    return Math.min(1, objectCount / 40);
  }