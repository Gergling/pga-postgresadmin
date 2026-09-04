// 3. Normal Procedure for Finding Ping Reliability

// Do not loop it continuously. Running a network ping on an infinite,
// immediate loop creates an unintentional, localized Denial of Service (DoS)
// attack against your targets.

// Even if your target doesn't crash, the target's firewall will quickly notice
// the persistent traffic and block your IP address entirely.

// The standard practice: Run a burst of 3 to 5 pings every 10 to 30 seconds.
// Space the pings within the burst by 100ms–200ms.
// Aggregate those numbers to calculate your latency, reliability, and jitter.
// Sleep for 10–30 seconds before doing it again.

// The Math for Jitter (RFC 3550 Standard)
// Take the absolute difference between consecutive pings and calculate the
// average
// :typescript
// // Example packet array from a single burst
// const latencies =; 

// const diff1 = Math.abs(150 - 30); // 120
// const diff2 = Math.abs(40 - 150); // 110

// const jitter = (diff1 + diff2) / 2; // 115ms Jitter!
// Use code with caution.
// A jitter value above 15ms–20ms usually indicates bufferbloat or network
// congestion, making it a powerful metric to change your UX icon color
// from green to orange, even if the baseline latency looks fine.

// RFC 3550 Jitter
const [previous, ...rest] = [1, 2, 3, 4, 5];

const diffs = [];

rest.reduce((previous, value) => {
  const diff = Math.abs(value - previous);
  diffs.push(diff);
  return value;
}, previous);
