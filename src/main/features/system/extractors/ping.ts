import net from 'net';

interface PingResult {
  success: boolean;
  latencyMs?: number;
  target?: string;
}

const FALLBACK_TARGETS = [
  { host: '8.8.8.8', port: 53 }, // Google DNS (Highly stable, globally distributed)
  { host: '9.9.9.9', port: 53 }, // Quad9 DNS (Secure, fast fallback)
  { host: '208.67.222.222', port: 53 } // OpenDNS
];

/**
 * Measures TCP handshake latency to a reliable public server.
 * Bypasses Cloudflare entirely and cycles through fallbacks if one is down.
 */
export async function getPingLatency(timeout = 1500): Promise<PingResult> {
  for (const target of FALLBACK_TARGETS) {
    const result = await new Promise<PingResult>((resolve) => {
      const socket = new net.Socket();

      // Mark high-resolution start time
      const start = process.hrtime.bigint();

      socket.setTimeout(timeout);

      socket.on('connect', () => {
        // Mark high-resolution end time
        const end = process.hrtime.bigint();
        socket.destroy();

        // Calculate difference in milliseconds (nanoseconds / 1_000_000)
        const latencyMs = Number(end - start) / 1_000_000;

        resolve({
          success: true,
          latencyMs: Math.round(latencyMs * 100) / 100, // Round to 2 decimal places
          target: target.host
        });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ success: false });
      });

      socket.on('error', () => {
        socket.destroy();
        resolve({ success: false });
      });

      socket.connect(target.port, target.host);
    });

    // If the ping to this specific target succeeded, return it immediately
    if (result.success) {
      return result;
    }
  }

  // All fallback targets failed
  return { success: false };
}
