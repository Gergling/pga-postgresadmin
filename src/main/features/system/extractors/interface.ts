import os from 'os';

export function getNetworkInterfaceType(): 'wifi' | 'ethernet' | 'offline' {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    // Skip internal/loopback adapters (like 127.0.0.1)
    if (name.toLowerCase().includes('loopback') || name.toLowerCase().includes('internal')) {
      continue;
    }

    // Check if the adapter is actively assigned an IP address
    const hasAddress = interfaces[name]?.some(net => !net.internal);
    if (!hasAddress) continue;

    // Use common OS naming conventions to infer interface type
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
      return 'wifi';
    }
    if (lowerName.includes('ethernet') || lowerName.includes('eth') || lowerName.includes('en')) {
      return 'ethernet';
    }
  }

  return 'offline';
}
