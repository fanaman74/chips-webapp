export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { syncCallsFromEU } = await import("@/lib/calls");
  const { schedule } = await import("node-cron");

  // Sync on startup
  syncCallsFromEU().then((r) => console.log("[sync-calls] startup:", r));

  // Re-sync every 24 hours at 02:00 UTC
  schedule("0 2 * * *", () => {
    syncCallsFromEU().then((r) => console.log("[sync-calls] cron:", r));
  });
}
