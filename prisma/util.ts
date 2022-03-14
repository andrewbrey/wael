import { join, resolve } from 'node:path';

/**
 * Calculate the absolut path of a fixture generator/entry file
 *
 * @param fixtureFilename
 * @returns the resolved file path
 */
export const p = (fixtureFilename: `${string}.${'ts' | 'json'}`) =>
  resolve(__dirname, join('fixtures', fixtureFilename));
