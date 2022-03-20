import { type LogEntry } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";

interface TableProps {
  data: LogEntry[];
}

export const Table = ({ data }: TableProps) => {
  return (
    <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
          >
            Date
          </th>
          <th
            scope="col"
            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
          >
            Weight
          </th>
          <th
            scope="col"
            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
          >
            Cardio
          </th>
          <th
            scope="col"
            className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
          >
            Lift
          </th>
          <th
            scope="col"
            className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
          >
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.map((log, idx) => {
          const formatted = format(log.createdAt, "EEEE MMM do, yyyy");

          return (
            <tr key={log.id}>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b border-gray-200" : "",
                  "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                )}
              >
                {formatted}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b border-gray-200" : "",
                  "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell"
                )}
              >
                {log.weight}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b border-gray-200" : "",
                  "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell"
                )}
              >
                {log.cardio ? "Yes" : "No"}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b border-gray-200" : "",
                  "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                )}
              >
                {log.lift ? "Yes" : "No"}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b border-gray-200" : "",
                  "whitespace-pre-line px-3 py-4 text-sm text-gray-500"
                )}
              >
                {log.notes}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
