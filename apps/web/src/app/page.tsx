import { AppFrame } from "../components/app-frame";

export default function HomePage() {
  return (
    <AppFrame>
      <div className="prose prose-slate max-w-none dark:prose-invert">
        <h1>Metriq MVP</h1>
        <p>
          This is the initial scaffold. Next we’ll add the role switcher, real routes per role,
          Kysely + Postgres data, and tRPC-backed screens.
        </p>
      </div>
    </AppFrame>
  );
}

