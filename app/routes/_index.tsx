import type {
  DataFunctionArgs,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

interface Env {
  DB: D1Database;
}

interface EmployeeRow {
  EmployeeID: number;
  LastName: string;
  FirstName: string;
  Title: string;
  BirthDate: string;
  HireDate: string;
  City: string;
  Country: string;
}

const QUERY = "SELECT EmployeeID, LastName, FirstName, Title, BirthDate, HireDate, City, Country FROM Employees LIMIT 20;";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const loader = async ({ context, params }: LoaderArgs) => {
  let env = context.env as Env;
  return await env.DB.prepare(QUERY).all();
};

export default function Index() {
  const { results, meta } = useLoaderData<LoaderData>();
  return (
    <div className="container mx-auto">
      <div className="flex flex-col py-8 justify-center items-center">
        <h1 className="text-orange-500 font-extrabold text-4xl max-w-md">
          Remix x Cloudflare D1 - Northwind Database
        </h1>
        <div className="py-4">
          <h2 className="font-extrabold text-2xl py-4 text-blue-800">Docs</h2>
          <ul className="list-disc leading-relaxed">
            <li className="text-300 text-1xl underline">
              <Link to="https://developers.cloudflare.com/d1/">
                Learn more about D1
              </Link>
            </li>
            <li className="text-300 text-1xl underline">
              <Link to="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/">
                Deploy your own Remix site to Cloudflare Pages
              </Link>
            </li>
            <li className="text-300 text-1xl underline">
              <Link to="https://developers.cloudflare.com/d1/examples/d1-and-remix/">
                Example: Remix loader function querying D1
              </Link>
            </li>
          </ul>
        </div>
        <div className="inline-block max-w-full overflow-scroll px-4 justify-center items-center">
          <h2 className="font-extrabold text-2xl py-4 text-blue-800">
            Employees
          </h2>
          <pre className="text-mono text-sm my-1">Executed: {QUERY}</pre>
          <div className="py-2 md-px-8 whitespace-nowrap">
            <table className="rounded-xl border-collapse text-sm md:text-md font-light">
              <thead className="border-b dark:border-neutral-500 bg-slate-200">
                <tr className="font-bold text-left break-words">
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Last Name</th>
                  <th scope="col" className="px-6 py-4">First Name</th>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4">Birth Date</th>
                  <th scope="col" className="px-6 py-4">Hire Date</th>
                  <th scope="col" className="px-6 py-4">City</th>
                  <th scope="col" className="px-6 py-4">Country</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row: EmployeeRow) => (
                  <tr key={row.EmployeeID} className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4">{row.EmployeeID}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.LastName}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.FirstName}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.Title}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.BirthDate}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.HireDate}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.City}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.Country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs py-4">
            Query runtime: {meta.duration.toPrecision(2)} ms
          </p>
        </div>
      </div>
    </div>
  );
}
