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
  return [{ href: tw, rel: "stylesheet" }];
};

export const meta: MetaFunction = () => {
  return { title: "wael" };
};

export default function App() {
  return (
    <html lang="en" className="font-serif sm:text-blue-500 antialiased font-light bg-stone-100 text-stone-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
