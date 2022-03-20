import { type LogEntry } from "@prisma/client";
import { type LoaderFunction } from "remix";
import { ClientOnly } from "remix-utils";
import { CSRChart, SSRChart } from "~/components/wael-chart";
import { Table } from "~/components/wael-table";
import { db } from "~/utils/db.server";
import { json, useLoaderData } from "~/utils/io";

type LoaderData = { entries: Array<LogEntry> };

export const loader: LoaderFunction = async () => {
  const entries = await db.logEntry.findMany({ orderBy: { createdAt: "desc" } });

  return json<LoaderData>({ entries });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="relative flex h-full flex-col overflow-hidden">
      <header className="absolute top-4 right-4">
        <h1 className="text-right text-3xl font-bold text-gray-800">WAEL</h1>
        <p className="font-thin text-gray-500">the weight and exercise log</p>
      </header>

      <div className="relative max-h-[50%] flex-grow overflow-hidden md:max-h-[65%]">
        <ClientOnly fallback={<SSRChart />}>{() => <CSRChart data={data.entries} />}</ClientOnly>
      </div>

      <div className="mt-6 max-h-[50%] flex-shrink-0 flex-grow overflow-y-auto overflow-x-hidden md:max-h-[35%]">
        <Table data={data.entries} />
      </div>
    </main>
  );
}
