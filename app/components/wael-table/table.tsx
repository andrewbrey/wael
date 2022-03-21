import { type LogEntry } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";

interface TableProps {
  data: LogEntry[];
}

export const Table = ({ data }: TableProps) => {
  const newestFirst = [...data].reverse();

  const commonHeaderStyles =
    "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-80 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter";

  const commonCellStyles = "px-3 py-4 text-sm text-gray-500 border-gray-200";

  return (
    <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
      <thead className="bg-white">
        <tr>
          <th scope="col" className={clsx(commonHeaderStyles, "pl-1 pr-3")}>
            <span className="lg:hidden">Log Entries</span>
            <span className="hidden lg:inline">Date</span>
          </th>
          <th scope="col" className={clsx(commonHeaderStyles, "hidden px-3 lg:table-cell")}>
            Weight
          </th>
          <th scope="col" className={clsx(commonHeaderStyles, "hidden px-3 lg:table-cell")}>
            Cardio
          </th>
          <th scope="col" className={clsx(commonHeaderStyles, "hidden px-3 lg:table-cell")}>
            Lift
          </th>
          <th scope="col" className={clsx(commonHeaderStyles, "hidden px-3 lg:table-cell")}>
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {newestFirst.map((log, idx) => {
          const formatted = format(log.createdAt, "EEEE MMM do, yyyy");

          return (
            <tr key={log.id}>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b" : "",
                  commonCellStyles,
                  "whitespace-nowrap pl-1 text-sm font-medium"
                )}
              >
                <span className="text-gray-900">{formatted}</span>
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b" : "",
                  commonCellStyles,
                  "hidden whitespace-nowrap lg:table-cell"
                )}
              >
                {log.weight}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b" : "",
                  commonCellStyles,
                  "hidden whitespace-nowrap lg:table-cell"
                )}
              >
                {log.cardio ? (
                  <span className="lg:underline lg:decoration-dotted">Yes</span>
                ) : (
                  <span className="">No</span>
                )}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b" : "",
                  commonCellStyles,
                  "hidden whitespace-nowrap lg:table-cell"
                )}
              >
                {log.lift ? (
                  <span className="lg:underline lg:decoration-dotted">Yes</span>
                ) : (
                  <span className="">No</span>
                )}
              </td>
              <td
                className={clsx(
                  idx !== data.length - 1 ? "border-b" : "",
                  commonCellStyles,
                  "hidden whitespace-pre-line lg:table-cell"
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
