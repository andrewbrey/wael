import { format } from "date-fns";
import { Form, Link, redirect, useParams, type ActionFunction, type LoaderFunction } from "remix";
import { notFound } from "remix-utils";
import { db } from "~/utils/db.server";
import { json, useLoaderData } from "~/utils/io";

export const action: ActionFunction = async ({ params }) => {
  await db.logEntry.delete({ where: { id: params.logEntry } });

  return redirect("/");
};

type LoaderData = { createdAt: string };

export const loader: LoaderFunction = async ({ params }) => {
  const entry = await db.logEntry.findUnique({
    select: { createdAt: true },
    where: { id: params.logEntry },
  });

  if (!entry) throw notFound({ id: params.logEntry });

  return json<LoaderData>({ createdAt: format(entry.createdAt, "EEEE MMM do, yyyy") });
};

export default function ConfirmDeleteEntryRoute() {
  const params = useParams();
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="grid min-h-full place-items-center overflow-auto p-6">
      <Form className="max-w-screen-sm space-y-8" method="post">
        <div className="select-none">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Log Entry for {loaderData.createdAt}?</h3>
          <p className="mt-1 text-sm text-gray-500">This will permanently delete this entry from the database</p>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              to={params.logEntry ? `/${params.logEntry}` : "/"}
              className="select-none rounded-sm border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              No, nevermind
            </Link>
            <button
              type="submit"
              name="_action"
              value="update"
              className="ml-3 inline-flex select-none justify-center rounded-sm border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Yes, delete
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
