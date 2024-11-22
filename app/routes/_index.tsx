import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

interface Env {
  DB: D1Database;
}

interface UserRow {
  user_id: number;
  email_address: string;
  created_at: number | null;
  deleted: number | null;
  settings: string | null;
}

const USER_QUERY = "SELECT * FROM users ORDER BY user_id ASC;";

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  return await env.DB.prepare(USER_QUERY).all();
};

function formatTimestamp(timestamp: number | null): string {
  if (timestamp === null) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
}

function formatDeleted(deleted: number | null): string {
  if (deleted === null) return 'N/A';
  return deleted === 1 ? 'Yes' : 'No';
}

export default function Index() {
  const { results, meta } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto">
      <div className="flex flex-col py-8 justify-center items-center">
        <h1 className="text-orange-500 font-extrabold text-4xl max-w-md">
          Remix x Cloudflare D1
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
            Users ({results.length})
          </h2>
          <pre className="text-mono text-sm my-1">Executed: {USER_QUERY}</pre>
          <div className="py-2 md-px-8 whitespace-nowrap">
            <table className="rounded-xl border-collapse text-sm md:text-md font-light">
              <thead className="border-b dark:border-neutral-500 bg-slate-200">
                <tr className="font-bold text-left break-words">
                  <th scope="col" className="px-6 py-4">User ID</th>
                  <th scope="col" className="px-6 py-4">Email Address</th>
                  <th scope="col" className="px-6 py-4">Created At</th>
                  <th scope="col" className="px-6 py-4">Deleted</th>
                  <th scope="col" className="px-6 py-4">Settings</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row: UserRow) => (
                  <tr key={row.user_id} className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4">{row.user_id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.email_address}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatTimestamp(row.created_at)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatDeleted(row.deleted)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{row.settings || 'N/A'}</td>
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