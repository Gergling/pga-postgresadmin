export function registerCleanup(cleanupFn: () => void | Promise<void>) {
  let cleaned = false;

  const runCleanup = async () => {
    if (cleaned) return;
    cleaned = true;

    try {
      await cleanupFn();
    } catch (err) {
      console.error("Cleanup failed:", err);
    }
  };

  // Normal exit
  process.on("exit", runCleanup);

  // Ctrl+C
  process.on("SIGINT", async () => {
    await runCleanup();
    process.exit(1);
  });

  // kill signal
  process.on("SIGTERM", async () => {
    await runCleanup();
    process.exit(1);
  });

  // Uncaught exceptions
  process.on("uncaughtException", async (err) => {
    console.error("Uncaught exception:", err);
    await runCleanup();
    process.exit(1);
  });

  // Unhandled promise rejections
  process.on("unhandledRejection", async (reason) => {
    console.error("Unhandled rejection:", reason);
    await runCleanup();
    process.exit(1);
  });
}
