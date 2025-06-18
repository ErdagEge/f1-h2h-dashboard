import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">F1 Head-to-Head Dashboard</h1>
      <p>
        Welcome to the dashboard for Formula&nbsp;1 statistics. Compare drivers
        across seasons and dive into detailed race results.
      </p>
      <p>
        <Link href="/compare" className="text-blue-600 underline">
          Go to the comparison page
        </Link>
      </p>
      <p>
        Planned features include interactive charts, additional statistics and
        advanced filtering options.
      </p>
    </main>
  );
}