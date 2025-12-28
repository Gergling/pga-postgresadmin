// TODO: Probably don't need this anymore. If we want health logging, we can probably do better.
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { firebasedDb } from "./config";

export async function runHeartbeatTest() {
  try {
    console.log("Checking Firebase connection...");
    
    // Attempt to write a temporary test document
    const docRef = await addDoc(collection(firebasedDb, "heartbeat"), {
      timestamp: Date.now(),
      message: "Testing from Electron App",
      device: "Laptop"
    });
    
    console.log("Test Write Success! ID:", docRef.id);

    // Attempt to read it back
    const querySnapshot = await getDocs(collection(firebasedDb, "heartbeat"));
    console.log(`Test Read Success! Found ${querySnapshot.size} heartbeat logs.`);
    
  } catch (e) {
    console.error("Firebase Test Failed. Error Details:", e);
  }
}
