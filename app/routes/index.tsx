import { type LogEntry } from "@prisma/client";
import { formatRelative } from "date-fns";
import { Link, type LoaderFunction } from "remix";
import { ClientOnly } from "remix-utils";
import { CSRChart, SSRChart } from "~/components/wael-chart";
import { Table } from "~/components/wael-table";
import { db } from "~/utils/db.server";
import { json, useLoaderData } from "~/utils/io";
import { currentStreak } from "~/utils/streak.server";

type LoaderData = { entries: Array<LogEntry>; latest?: LogEntry; streak: number };

export const loader: LoaderFunction = async () => {
  const entries = await db.logEntry.findMany({ orderBy: { createdAt: "asc" } });

  const latest = entries.at(entries.length - 1);
  const streak = currentStreak(entries, latest);

  return json<LoaderData>({ entries, latest, streak });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  const fmtStreak = new Intl.NumberFormat().format(data.streak);

  return (
    <main className="relative flex h-full flex-col overflow-hidden">
      <header className="pointer-events-none absolute top-2 right-2 z-10 select-none bg-white p-2">
        <h1 className="text-right font-mono text-3xl font-bold tracking-widest text-gray-900 lg:text-5xl">
          <span>WA</span>
          <br />
          <span>EL</span>
        </h1>
      </header>

      <aside className="absolute top-2 left-2 z-10 bg-white p-2 text-sm">
        <dl className="space-y-3">
          <div>
            <dt className="text-gray-500">Last Log:</dt>
            <dd className="capitalize text-gray-800">
              {data.latest ? formatRelative(data.latest.createdAt, new Date()) : "Never"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Exercise Streak:</dt>
            <dd className="break-words capitalize text-gray-800">{fmtStreak}</dd>
          </div>
        </dl>
      </aside>

      <div className="relative m-4 max-h-[50%] flex-grow overflow-hidden md:max-h-[65%]">
        <ClientOnly fallback={<SSRChart />}>{() => <CSRChart data={data.entries} />}</ClientOnly>
      </div>

      <div className="m-4 max-h-[50%] flex-shrink-0 flex-grow overflow-auto outline-none ring-black focus-visible:ring-4 focus-visible:ring-offset-4 md:max-h-[35%]">
        <Table data={data.entries} />
      </div>

      <footer className="absolute right-4 bottom-4">
        <Link to="add" className="group">
          <span className="grid h-10 w-10 transform place-items-center bg-gray-900 text-white outline-none ring-black transition-transform hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-offset-4 group-active:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </Link>
      </footer>
    </main>
  );
}
