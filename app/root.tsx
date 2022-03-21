import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  type MetaFunction,
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
        <Outlet />
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
}

// TODO add catch boundary and error boundary for 404 pages and errors
