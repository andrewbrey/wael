import { type LogEntry } from "@prisma/client";
import { isSameDay, isToday, isYesterday, startOfDay, subDays } from "date-fns";

export function currentStreak(entries: Array<LogEntry>, latest?: LogEntry) {
  if (!latest) return 0;
  if (!(isToday(latest.createdAt) || isYesterday(latest.createdAt))) return 0;
  if (!(latest.cardio || latest.lift)) return 0;

  let count = 1;
  let cursor = latest.createdAt;

  for (let i = entries.length - 1; i >= 0; i--) {
    const { createdAt, cardio, lift } = entries[i];
    if (isSameDay(createdAt, cursor)) continue;

    if (isSameDay(createdAt, subDays(cursor, 1))) {
      cursor = createdAt;
      if (cardio || lift) count++;
    }
  }

  return count;
}

export function totalDays(entries: Array<LogEntry>) {
  let seen = new Set<string>();

  entries.forEach((e) => seen.add(startOfDay(e.createdAt).toISOString()));

  return seen.size;
}
