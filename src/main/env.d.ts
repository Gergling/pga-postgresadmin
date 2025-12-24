declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly IMAP_HOST: string;
    readonly IMAP_USER: string;
    readonly IMAP_PASS: string;
  }
}
