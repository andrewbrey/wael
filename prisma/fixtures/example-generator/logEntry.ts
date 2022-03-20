/**
 * Copy this file into prisma/fixture/ and modify as needed to
 * generate the seed json used to populate the prisma database.
 *
 * Note that the only requirements are:
 * 1. The generator filename is the name of a prisma model (with a `.ts` extension)
 * 2. The generator produces a json file of the same basename with the seed data in it
 */

import { faker } from "@faker-js/faker";
import { type LogEntry } from "@prisma/client";
import { subDays } from "date-fns";
import { writeFile } from "fs-extra";
import { parse } from "node:path";
import superjson from "superjson";
import { p } from "../../util";

const file = parse(__filename);

async function main() {
  const entries: LogEntry[] = new Array(100)
    .fill(null)
    .map((_, idx) => idx + 1)
    .map(
      (d, idx, { length }) =>
        ({
          id: `seed-logEntry-${d}`,
          weight: faker.datatype.float({ min: 158, max: 170, precision: 0.1 }),
          cardio: true,
          lift: idx % 2 === 0,
          notes: faker.datatype.boolean() ? faker.lorem.lines() : null,
          createdAt: subDays(new Date(), length - d),
          updatedAt: subDays(new Date(), length - d),
        } as LogEntry)
    );

  await writeFile(p(`${file.name}.json`), superjson.stringify(entries));
}

main();
