import { json as remix_json, useActionData as remix_useActionData, useLoaderData as remix_useLoaderData } from "remix";
import superjson from "superjson";

export function json<Data>(data: Data, init?: number | ResponseInit): Response {
  return remix_json(superjson.serialize(data), init);
}

export function useLoaderData<T>(): T {
  return superjson.deserialize<T>(remix_useLoaderData());
}

export function useActionData<T>(): T | undefined {
  const data = remix_useActionData();

  return data ? superjson.deserialize<T>(data) : undefined;
}
