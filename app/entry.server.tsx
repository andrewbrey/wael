import { Headers, Response } from "@remix-run/node";
import isbot from "isbot";
import { PassThrough } from "node:stream";
// TODO: remove ts-expect-error when @types are updated
// @ts-expect-error
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, type EntryContext } from "remix";

const ABORT_TIMEOUT = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";

  return new Promise((resolve) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} />, {
      [callbackName]() {
        const body = new PassThrough();

        responseHeaders.set("Content-Type", "text/html");

        resolve(
          new Response(body, {
            status: didError ? 500 : responseStatusCode,
            headers: responseHeaders,
          })
        );
        pipe(body);
      },
      onError(error: Error) {
        didError = true;
        console.error(error);
      },
    });
    setTimeout(abort, ABORT_TIMEOUT);
  });
}
