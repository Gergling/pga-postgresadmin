import { useState, useEffect } from 'react';
import { addDoc, doc, onSnapshot, collection, getDocs, limit, query } from "firebase/firestore";
import { runHeartbeatTest } from './heartbeat';
import { UserTask } from '../../../shared/types';
import { firebasedDb } from './config';

export const commitToDiary = async (rawText: string) => {
  // Eventually, the Council (AI) will determine these numbers.
  // For now, let's hardcode a 'default' score to test the flow.
  const newTask: UserTask = {
    text: rawText,
    energy: rawText.includes("coding") ? 2 : -2,
    friction: 3,
    timestamp: Date.now()
  };

  const docRef = await addDoc(collection(firebasedDb, "diary"), newTask);
  return docRef.id;
};

const wakeUpDB = async () => {
  try {
    // Just try to fetch a single document from any collection (even if it's empty)
    const q = query(collection(firebasedDb, "test_logs"), limit(1));
    await getDocs(q);
    console.log("🚀 Firestore 'Wake Up' call successful.");
  } catch (e) {
    console.error("🚨 Actual Connection Error:", e);
  }
};

export const useFirebaseStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  useEffect(() => {
    // 1. Monitor Browser Network Status
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    // 2. Monitor Firestore Connection
    // Firebase provides a special metadata document for this
    const [path, pathSegments] = ["diary_entries", "connection_status"];
    const unsub = onSnapshot(doc(firebasedDb, path, pathSegments), (doc) => {
      console.log("For path", path, pathSegments);
      console.log("Document exists?", doc.exists());
      console.log("Metadata (fromCache):", doc.metadata.fromCache);
      console.log("Current data: ", doc.data());
      console.log("Source: ", doc.metadata.fromCache ? "Local Cache" : "Server");
      console.log("Has pending writes: ", doc.metadata.hasPendingWrites);
      setDbConnected(doc.data()?.connected === true);
    });

    runHeartbeatTest();
    wakeUpDB();

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      unsub();
    };
  }, []);

  return { isOnline, dbConnected };
};