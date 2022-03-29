import { type LogEntry } from "@prisma/client";
import { format, formatRelative } from "date-fns";
import { Link, type LoaderFunction } from "remix";
import { ClientOnly } from "remix-utils";
import { CSRChart, SSRChart } from "~/components/wael-chart";
import { Table } from "~/components/wael-table";
import { type LogEntryWithFmt } from "~/types";
import { db } from "~/utils/db.server";
import { json, useLoaderData } from "~/utils/io";
import { currentStreak, totalDays } from "~/utils/stats.server";

type LoaderData = {
  entries: Array<LogEntryWithFmt>;
  latest?: LogEntry;
  latestRelative?: string;
  streak: string;
  totalDays: string;
  weight: { high: string | null; low: string | null; avg: string | null };
};

export const loader: LoaderFunction = async () => {
  const entries = await db.logEntry.findMany({ orderBy: { createdAt: "asc" } });
  const extrema = await db.logEntry.aggregate({
    _max: { weight: true },
    _min: { weight: true },
    _avg: { weight: true },
  });

  const latest = entries.at(entries.length - 1);
  const streak = currentStreak(entries, latest);
  const total = totalDays(entries);

  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 0 });

  return json<LoaderData>({
    entries: entries.map((e) => ({ ...e, fmtCreatedAt: format(e.createdAt, "EEEE MMM do, yyyy") })),
    latest,
    latestRelative: latest?.createdAt ? formatRelative(latest.createdAt, new Date()) : "Never",
    streak: fmt.format(streak),
    totalDays: fmt.format(total),
    weight: {
      high: fmt.format(extrema._max.weight ?? 0),
      low: fmt.format(extrema._min.weight ?? 0),
      avg: fmt.format(extrema._avg.weight ?? 0),
    },
  });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="relative flex h-full flex-col overflow-hidden">
      <header className="pointer-events-none absolute top-2 right-2 z-10 select-none bg-white p-2">
        <h1 className="text-right font-mono text-3xl font-bold tracking-widest text-gray-900 lg:text-5xl">
          <span>WA</span>
          <br />
          <span>EL</span>
        </h1>
      </header>

      <section className="relative mx-4 mt-4 max-h-[50%] flex-grow overflow-hidden md:max-h-[65%]">
        <ClientOnly fallback={<SSRChart />}>{() => <CSRChart data={data.entries} />}</ClientOnly>
      </section>

      <aside className="mx-4 flex items-center justify-start pb-1 pt-4 text-xs lg:justify-center lg:pb-2 lg:pt-2 lg:text-sm">
        <dl className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="flex space-x-2">
            <dt className="text-gray-600">Latest:</dt>
            <dd className="font-bold capitalize text-gray-900">{data.latestRelative}</dd>
          </div>
          <div className="flex space-x-2">
            <dt className="text-gray-600">Streak:</dt>
            <dd className="break-words font-bold capitalize text-gray-900">{data.streak}</dd>
          </div>
          <div className="flex space-x-2">
            <dt className="text-gray-600">Total Days:</dt>
            <dd className="break-words font-bold capitalize text-gray-900">{data.totalDays}</dd>
          </div>
          <div className="flex space-x-4 lg:space-x-6">
            {data.weight.high ? (
              <div className="flex space-x-2">
                <dt className="text-gray-600">High:</dt>
                <dd className="break-words font-bold capitalize text-gray-900">{data.weight.high}</dd>
              </div>
            ) : null}
            {data.weight.low ? (
              <div className="flex space-x-2">
                <dt className="text-gray-600">Low:</dt>
                <dd className="break-words font-bold capitalize text-gray-900">{data.weight.low}</dd>
              </div>
            ) : null}
            {data.weight.avg ? (
              <div className="flex space-x-2">
                <dt className="text-gray-600">Avg:</dt>
                <dd className="break-words font-bold capitalize text-gray-900">{data.weight.avg}</dd>
              </div>
            ) : null}
          </div>
        </dl>
      </aside>

      <section className="mx-4 max-h-[50%] flex-shrink-0 flex-grow overflow-auto outline-none ring-black focus-visible:ring-4 focus-visible:ring-offset-4 md:max-h-[35%]">
        <Table data={data.entries} />
      </section>

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
