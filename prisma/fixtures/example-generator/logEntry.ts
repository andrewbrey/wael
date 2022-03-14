/**
 * Copy this file into prisma/fixture/ and modify as needed to
 * generate the seed json used to populate the prisma database.
 *
 * Note that the only requirements are:
 * 1. The generator filename is the name of a prisma model (with a `.ts` extension)
 * 2. The generator produces a json file of the same basename with the seed data in it
 */

import { type LogEntry } from '@prisma/client';
import { subDays } from 'date-fns';
import { writeJson } from 'fs-extra';
import { parse } from 'node:path';
import { p } from '../../util';

const file = parse(__filename);

async function main() {
  const entries: LogEntry[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (d, _idx, { length }) =>
      ({
        id: `seed-logEntry-${d}`,
        createdAt: subDays(new Date(), length - d),
        updatedAt: subDays(new Date(), length - d),
      } as LogEntry)
  );

  await writeJson(p(`${file.name}.json`), entries, { spaces: 2 });
}

main();
