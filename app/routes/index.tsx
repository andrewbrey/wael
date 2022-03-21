import { redirect, type LoaderFunction } from "remix";

export const loader: LoaderFunction = () => {
  return redirect("/log");
};
