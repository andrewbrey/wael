import { renderToString } from "react-dom/server";
import { RemixServer, type EntryContext } from "remix";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // TODO: use `renderToReadableStream`? That export doesn't exist in `@types` but
  // the React 18 upgrade docs recommend it...not sure what's goin on, so just
  // using `renderToString` which still works, but in a more limited way
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
