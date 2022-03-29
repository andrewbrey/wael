import { LogEntry } from "@prisma/client";

export type LogEntryWithFmt = LogEntry & { fmtCreatedAt: string };
