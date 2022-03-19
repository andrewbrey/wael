import { type LogEntry } from "@prisma/client";
import { useLoaderData, type LoaderFunction } from "remix";
import { ClientOnly } from "remix-utils";
import { CSRChart, SSRChart } from "~/components/wael-chart";
import { db } from "~/utils/db.server";

type LoaderData = { entries: Array<LogEntry> };

export const loader: LoaderFunction = async () => {
  const entries = await db.logEntry.findMany();

  const data: LoaderData = { entries };

  return data;
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>WAEL</h1>

      <ClientOnly fallback={<SSRChart />}>{() => <CSRChart data={data.entries} />}</ClientOnly>
    </div>
  );
}
