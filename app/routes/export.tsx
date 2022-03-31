import { type LogEntry } from "@prisma/client";
import { formatISO } from "date-fns";
import { json, type LoaderFunction } from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const format = new URL(request.url).searchParams.get("format");

  const all = await db.logEntry.findMany({ orderBy: { createdAt: "desc" } });

  if (format === "text") {
    const headers = new Headers();
    headers.set("Content-Type", "text/plain; charset=utf-8");

    const headerRow = "ID,CREATED_AT,UPDATED_AT,WEIGHT,CARDIO,LIFT,NOTES";

    return new Response([headerRow, ...all.map(entryToCSVRow)].join("\n"), {
      status: 200,
      headers,
    });
  }

  return json(all);
};

function entryToCSVRow(entry: LogEntry) {
  return [
    entry.id,
    formatISO(entry.createdAt),
    formatISO(entry.updatedAt),
    entry.weight,
    entry.cardio ? "TRUE" : "FALSE",
    entry.lift ? "TRUE" : "FALSE",
    JSON.stringify(entry.notes ?? ""),
  ].join(",");
}
