import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface Env {
  DB: D1Database;
}

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  const { results } = await env.DB.prepare("SELECT email_address FROM users;").all();
  return json({ emails: results });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ padding: "20px" }}>
      <h1>User Emails</h1>
      <ul>
        {data.emails.map((row: { email_address: string }, index: number) => (
          <li key={index}>{row.email_address}</li>
        ))}
      </ul>
    </div>
  );
}