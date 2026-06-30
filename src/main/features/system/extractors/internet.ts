import dns from 'dns';

export function checkInternetAccess(): Promise<boolean> {
  return new Promise((resolve) => {
    // Attempting to resolve a prominent domain name
    dns.lookup('one.one.one.one', (err) => {
      if (err && err.code === 'ENOTFOUND') {
        resolve(false); // No internet connection found
      } else {
        resolve(true);  // Internet access confirmed
      }
    });
  });
}