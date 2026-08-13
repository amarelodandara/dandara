import { spawn, type ChildProcess } from "node:child_process";
import process from "node:process";

const ROOT = process.cwd();

const SPAWN_PORT = 3999;

const PROBE_TIMEOUT = 1500;
const QUICK_PROBE_TIMEOUT = 800;
const SERVER_BOOT_LIMIT = 90_000;
const POLL_INTERVAL = 500;
const STOP_GRACE = 5000;

export async function reachable(baseUrl: string, timeoutMs = PROBE_TIMEOUT): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/cv?lang=en&variant=base`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) return true;
    throw new Error(
      `${baseUrl}/cv answered ${response.status}. If the site is running in production mode, /cv is a 404 by design — start \`npm run dev\`.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("/cv answered")) throw error;
    return false;
  }
}

export async function startServer(): Promise<{ baseUrl: string; child?: ChildProcess }> {
  const child = spawn("npx", ["next", "dev", "--port", String(SPAWN_PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  let elsewhere: string | undefined;

  const REFUSED = "Another next dev server is already running";

  const collect = (chunk: Buffer) => {
    output += chunk.toString();
    const marker = output.indexOf(REFUSED);
    if (marker !== -1) {
      elsewhere ??= output.slice(marker).match(/Local:\s+(http:\/\/\S+)/)?.[1];
    }
  };
  child.stdout?.on("data", collect);
  child.stderr?.on("data", collect);

  const deadline = Date.now() + SERVER_BOOT_LIMIT;
  const spawned = `http://localhost:${SPAWN_PORT}`;

  while (Date.now() < deadline) {
    if (elsewhere) {
      child.kill("SIGTERM");
      const base = elsewhere.replace(/\/$/, "");
      if (await reachable(base)) {
        console.log(`• reusing the dev server already running at ${base}`);
        return { baseUrl: base };
      }
      throw new Error(
        `Next reports a dev server at ${base} but it did not answer. Stop it and retry.`,
      );
    }
    if (child.exitCode !== null) {
      throw new Error(`next dev exited with code ${child.exitCode}:\n${output}`);
    }
    if (await reachable(spawned, QUICK_PROBE_TIMEOUT)) {
      console.log(`• started a dev server at ${spawned}`);
      return { baseUrl: spawned, child };
    }
    await new Promise((resume) => setTimeout(resume, POLL_INTERVAL));
  }

  child.kill("SIGKILL");
  throw new Error(`next dev did not come up in time:\n${output}`);
}

export async function stopServer(child: ChildProcess) {
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, STOP_GRACE);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}
