export function calculateMode(values: number[]): number {
  const frequencyMap: Map<number, number> = new Map();

  // Build frequency map
  values.forEach((value) => {
    frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
  });

  const maxFrequency = Math.max(...Array.from(frequencyMap.values()));

  // Extract values with max frequency
  const modes = Array.from(frequencyMap.entries())
    .filter(([, frequency]) => frequency === maxFrequency)
    .map(([value]) => value);

  // If there is a tie (multiple modes), return the midpoint of tied values
  if (modes.length > 1) {
    const midpoint = modes.reduce((sum, value) => sum + value, 0) / modes.length;
    return midpoint;
  }

  // If there is a single mode
  return modes[0];
}
