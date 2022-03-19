import { PrismaClient } from "@prisma/client";
import { execa } from "execa";
import { pathExists, readJson } from "fs-extra";
import { p } from "./util";

const db = new PrismaClient();

async function seed() {
  const fixtureTypes = ["logEntry"] as const; // values should match prisma model names

  for (const type of fixtureTypes) {
    const generatorPath = p(`${type}.ts`);
    const entriesPath = p(`${type}.json`);

    if (await pathExists(generatorPath)) {
      await execa("yarn", ["esno", generatorPath]);

      if (await pathExists(entriesPath)) {
        const entries = await readJson(entriesPath);

        console.log(`Found ${entries.length} entries of type ${type}. Adding them to the db...`);

        if (db[type]) {
          for (const entry of entries) {
            try {
              await db[type].upsert({ create: entry, update: entry, where: { id: entry.id } });
            } catch (error) {
              console.log("Error doing entry upsert:\n", error);
            }
          }
        }
      }
    }
  }
}

seed();
