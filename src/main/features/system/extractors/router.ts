import net from 'net';

export function testRouterConnection(gatewayIp: string, port = 80): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000); // 1-second timeout

    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Router is responding
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false); // Router unreachable or blocking port
    });

    socket.connect(port, gatewayIp);
  });
}
