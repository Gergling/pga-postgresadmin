import { FirebaseOptions, initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getEnvVar } from "../../env";

type FirebaseConfigMap = {
  [K in keyof FirebaseOptions]: keyof ImportMetaEnv;
};

const firebaseConfigMap: FirebaseConfigMap = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
  measurementId: 'VITE_FIREBASE_MEASUREMENT_ID'
};

const firebaseConfig = Object.entries(firebaseConfigMap).reduce((firebaseConfig, [key, value]) => {
  const envValue = getEnvVar(value);
  return {
    ...firebaseConfig,
    [key as keyof FirebaseOptions]: envValue
  };
}, {});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// if (await isSupportedAnalytics())
// const analytics = getAnalytics(app);
// console.log('firebase analytics', analytics);

// Initialize Firestore with Offline Persistence enabled
export const firebasedDb = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
