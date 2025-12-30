declare namespace NodeJS {
  interface ProcessEnv {
    readonly FIREBASE_SERVICE_ACCOUNT_PATH: string;

    readonly IMAP_HOST: string;
    readonly IMAP_USER: string;
    readonly IMAP_PASS: string;

    readonly VITE_GEMINI_API_KEY: string;
  }
}
