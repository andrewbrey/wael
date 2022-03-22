import { Link, Form, redirect, type ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { json, useActionData } from "~/utils/io";

interface ActionData {
  formError?: string;
  fieldErrors?: { weight?: string; notes?: string };
  fields?: {
    weight: number;
    notes: string;
  };
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const weight = parseFloat(`${formData.get("weight")}`);
  const notes = `${formData.get("notes")}`.trim();
  const cardio = !!formData.get("cardio");
  const lift = !!formData.get("lift");

  if (Number.isNaN(weight)) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fieldErrors = {
    weight: validateWeight(weight),
    notes: validateNotes(notes),
  };

  const fields = { weight, notes };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await db.logEntry.create({ data: { weight: parseFloat(weight.toFixed(1)), cardio, lift, notes } });

  return redirect("/");
};

function validateWeight(weight: number) {
  if (weight < 100 || weight > 1000) return "Weight must be between 100 and 1,000 lbs";
}

function validateNotes(notes: string) {
  if (notes.length > 500) return "Notes must be at most 500 characters";
}

export default function AddLogRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="grid min-h-full place-items-center overflow-auto p-6">
      <Form className="max-w-screen-sm space-y-8" method="post">
        <div className="space-y-8">
          <div>
            <div className="select-none">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add Log Entry</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in your weight and exercise log for the day and it will be added to your streak
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="weight" className="block select-none text-sm font-medium text-gray-700">
                  Weight
                </label>
                <div className="mt-1 flex rounded-sm shadow-sm">
                  <span className="inline-flex select-none items-center rounded-l-sm border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    lbs
                  </span>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    required
                    autoComplete="off"
                    autoFocus
                    defaultValue={actionData?.fields?.weight}
                    aria-invalid={Boolean(actionData?.fieldErrors?.weight)}
                    aria-errormessage={actionData?.fieldErrors?.weight ? "weight-error" : undefined}
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
              </div>
              {actionData?.fieldErrors?.weight ? (
                <p className="col-span-full select-none text-red-700" role="alert" id="weight-error">
                  {actionData.fieldErrors.weight}
                </p>
              ) : null}
              <div className="sm:col-span-6">
                <label htmlFor="notes" className="block select-none text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="block w-full rounded-sm border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    aria-invalid={Boolean(actionData?.fieldErrors?.notes)}
                    aria-errormessage={actionData?.fieldErrors?.notes ? "notes-error" : undefined}
                    defaultValue={actionData?.fields?.notes ?? ""}
                  />
                </div>
                <p className="mt-2 select-none text-sm text-gray-500">Add any notes about today's log entry.</p>
              </div>
              {actionData?.fieldErrors?.notes ? (
                <p className="col-span-full select-none text-red-700" role="alert" id="notes-error">
                  {actionData.fieldErrors.notes}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <fieldset>
          <legend className="select-none text-sm font-medium text-gray-700">Exercise</legend>
          <div className="mt-4 space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="cardio"
                  name="cardio"
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 cursor-pointer rounded-sm border-gray-300 text-gray-600 focus:ring-gray-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="cardio" className="cursor-pointer select-none font-medium text-gray-700">
                  Cardio
                </label>
                <p className="select-none text-gray-500">Log that you ran, cycled, or did something aerobic.</p>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="lift"
                  name="lift"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded-sm border-gray-300 text-gray-600 focus:ring-gray-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="lift" className="select-none font-medium text-gray-700">
                  Lift
                </label>
                <p className="select-none text-gray-500">
                  Log that you pushed or pulled something heavy, maybe even yourself.
                </p>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              to="/"
              className="select-none rounded-sm border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="ml-3 inline-flex select-none justify-center rounded-sm border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
