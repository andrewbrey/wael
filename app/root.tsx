import { type ReactNode } from "react";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  type LinksFunction,
  type MetaFunction,
  type ThrownResponse,
} from "remix";
import tw from "~/styles/wael.css";

export const links: LinksFunction = () => {
  return [
    { href: tw, rel: "stylesheet" },
    { href: "/apple-touch-icon.png", rel: "apple-touch-icon", sizes: "180x180" },
    { href: "/favicon-32x32.png", rel: "icon", type: "image/png", sizes: "32x32" },
    { href: "/favicon-16x16.png", rel: "icon", type: "image/png", sizes: "16x16" },
    { href: "/safari-pinned-tab.svg", rel: "mask-icon", color: "#2f2f2f" },
    { href: "/site.webmanifest", rel: "manifest" },
  ];
};

export const meta: MetaFunction = () => {
  return { title: "WAEL", "theme-color": "#ffffff", "msapplication-TileColor": "#ffffff" };
};

export default function App() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <RootLayout>
      <CaughtErrorComponent error={caught} />
    </RootLayout>
  );
}

export function ErrorBoundary(issue: unknown) {
  const { error } = issue as { error: Error };

  return (
    <RootLayout>
      <UnexpectedErrorComponent error={error} />
    </RootLayout>
  );
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="en"
    className="h-full bg-white font-mono font-light text-gray-900 antialiased selection:bg-gray-900 selection:text-white"
  >
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body className="h-full">
      {children}
      <ScrollRestoration />
      {process.env.NODE_ENV !== "production" ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // supress react devtools message
            
            ;((ctx) => {
              if(typeof ctx !== 'undefined' && typeof document !== 'undefined') {
                ctx.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
                  supportsFiber: true,
                  inject: function() {},
                  onCommitFiberRoot: function() {},
                  onCommitFiberUnmount: function() {},
                };
              }
            })(this);          
          `,
          }}
        ></script>
      ) : null}
      <Scripts />
      <LiveReload />
    </body>
  </html>
);

interface CaughtErrorComponentProps {
  error: ThrownResponse<number, any>;
}

const CaughtErrorComponent = ({ error }: CaughtErrorComponentProps) => {
  const message = error.status === 404 ? "Page not found" : "Error";

  return (
    <div className="min-h-full select-none bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-gray-600 sm:text-5xl">{error.status}</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{message}</h1>
              {error.status === 404 ? (
                <p className="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
              ) : (
                <pre className="whitespace-pre-line">{error.data}</pre>
              )}
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                replace={true}
                className="inline-flex items-center rounded-sm border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const UnexpectedErrorComponent = ({ error }: { error: Error }) => {
  const { message } = error;

  return (
    <div className="min-h-full select-none bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-gray-600 sm:text-5xl">500</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Something went wrong.
              </h1>
              <pre className="whitespace-pre-line">{message}</pre>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                replace={true}
                className="inline-flex items-center rounded-sm border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
