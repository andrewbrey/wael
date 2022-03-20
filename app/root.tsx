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
    // TODO add a real favicon
    { href: "https://fav.farm/🐋", rel: "icon" },
  ];
};

export const meta: MetaFunction = () => {
  return { title: "wael" };
};

export default function App() {
  return (
    <html lang="en" className="h-full bg-gray-100 font-serif font-light text-gray-900 antialiased">
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
