import { type ActionFunction, Link, Form, redirect, useActionData } from "remix";
import { json } from "~/utils/io";

interface ActionData {
  formError?: string;
  fieldErrors?: { name?: string; content?: string };
  fields?: {
    name: string;
    content: string;
  };
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const weight = formData.get("weight");
  const notes = formData.get("notes");
  const cardio = formData.get("cardio");
  const lift = formData.get("lift");

  console.log({ weight, notes, cardio, lift });

  return redirect("/");
};

/* 
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}?redirectTo=/jokes/new`);
};



*/

export default function AddLogRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="max-w-screen-xs grid min-h-full place-items-center overflow-auto p-6">
      <Form className="space-y-8" method="post">
        <div className="space-y-8">
          <div>
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add Log Entry</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in your weight and exercise log for the day and it will be added to your streak
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    lbs
                  </span>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    autoComplete="off"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Add any notes about today's log entry.</p>
              </div>
            </div>
          </div>
        </div>
        <fieldset>
          <legend className="text-base font-medium text-gray-900">Exercise</legend>
          <div className="mt-4 space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="cardio"
                  name="cardio"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="cardio" className="font-medium text-gray-700">
                  Cardio
                </label>
                <p className="text-gray-500">Log that you ran, cycled, or did something aerobic.</p>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="lift"
                  name="lift"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="lift" className="font-medium text-gray-700">
                  Lift
                </label>
                <p className="text-gray-500">Log that you pushed or pulled something heavy, maybe even yourself.</p>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              to="/"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
