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
    <html lang="en" className="bg-stone-100 font-serif font-light text-stone-900 antialiased">
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
