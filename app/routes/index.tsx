import { type LogEntry } from '@prisma/client';
import { useLoaderData, type LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = { logs: Array<LogEntry> };

export const loader: LoaderFunction = async () => {
  const logs = await db.logEntry.findMany();

  const data: LoaderData = { logs };

  return data;
};

export default function Index() {
  const logs = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>WAEL</h1>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}
