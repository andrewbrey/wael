import { type LogEntry } from "@prisma/client";
import { readFile } from "fs-extra";
import superjson from "superjson";
import { expect, test, vi } from "vitest";
import { join } from "node:path";

import { currentStreak, totalDays } from "~/utils/stats.server";

interface Fixture {
  entries: Array<LogEntry>;
  latest: LogEntry;
}

test("stats for fixture file work", async () => {
  const { entries, latest } = superjson.parse<Fixture>(
    await readFile(join(__dirname, "fixture", "logs.json"), { encoding: "utf-8" })
  );

  vi.useFakeTimers();
  vi.setSystemTime(latest.createdAt);

  const streak = currentStreak(entries, latest);
  const total = totalDays(entries);

  expect(streak).toBe(18);
  expect(total).toBe(100);

  vi.useRealTimers();
});
