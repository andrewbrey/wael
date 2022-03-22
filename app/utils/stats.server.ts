import { type LogEntry } from "@prisma/client";
import { isSameDay, isToday, isYesterday, startOfDay, subDays } from "date-fns";

export function currentStreak(ascSortedEntries: Array<LogEntry>, latest?: LogEntry) {
  if (!latest) return 0;
  if (!(isToday(latest.createdAt) || isYesterday(latest.createdAt))) return 0;
  if (!(latest.cardio || latest.lift)) return 0;

  let count = 1;
  let cursor = latest.createdAt;

  for (let i = ascSortedEntries.length - 1; i >= 0; i--) {
    const { createdAt, cardio, lift } = ascSortedEntries[i];
    if (isSameDay(createdAt, cursor)) continue;

    if (isSameDay(createdAt, subDays(cursor, 1)) && (cardio || lift)) {
      cursor = createdAt;
      count++;
    } else {
      break;
    }
  }

  return count;
}

export function totalDays(entries: Array<LogEntry>) {
  let seen = new Set<string>();

  entries.forEach((e) => seen.add(startOfDay(e.createdAt).toISOString()));

  return seen.size;
}
