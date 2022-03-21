import { type LogEntry } from "@prisma/client";
import { Link, type LoaderFunction } from "remix";
import { ClientOnly } from "remix-utils";
import { CSRChart, SSRChart } from "~/components/wael-chart";
import { Table } from "~/components/wael-table";
import { db } from "~/utils/db.server";
import { json, useLoaderData } from "~/utils/io";

type LoaderData = { entries: Array<LogEntry> };

export const loader: LoaderFunction = async () => {
  const entries = await db.logEntry.findMany({ orderBy: { createdAt: "asc" } });

  return json<LoaderData>({ entries });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="relative flex h-full flex-col overflow-hidden">
      <header className="pointer-events-none absolute top-4 right-4 select-none">
        <h1 className="text-right font-mono text-3xl font-bold tracking-widest text-gray-900 lg:text-5xl">
          <span>WA</span>
          <br />
          <span>EL</span>
        </h1>
      </header>

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
