// For copying between firebase collections

import { admin } from '@spacelabstech/firestoreorm';

async function copyCollection(sourceName, targetName) {
  const db = admin.firestore();
  const sourceRef = db.collection(sourceName);
  const targetRef = db.collection(targetName);
  const snapshot = await sourceRef.get();

  if (snapshot.empty) {
    return 0;
  }

  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    const targetDocRef = targetRef.doc(doc.id);
    batch.set(targetDocRef, doc.data());
  });

  await batch.commit();
  return snapshot.size;
}

// Example usage within Electron main process:
// copyCollection('users', 'users_backup')
//   .then(count => console.log(`Copied ${count} documents.`))
//   .catch(console.error);



// const { admin } = require('@spacelabstech/firestoreorm');

// /**
//  * Copies a collection to another destination with robust pagination and batching.
//  * @param {string} sourceName - Source collection ID.
//  * @param {string} targetName - Target collection ID.
//  * @returns {Promise<number>} Total documents copied.
//  */
// async function copyCollectionPaged(sourceName, targetName) {
//   const db = admin.firestore();
//   const sourceRef = db.collection(sourceName);
//   const targetRef = db.collection(targetName);
  
//   const BATCH_LIMIT = 500; // Firestore limit for atomic batches
//   let totalCopied = 0;
//   let lastDoc = null;
//   let hasMore = true;

//   while (hasMore) {
//     // 1. Build paginated query using cursors
//     let query = sourceRef.orderBy(admin.firestore.FieldPath.documentId()).limit(BATCH_LIMIT);
//     if (lastDoc) {
//       query = query.startAfter(lastDoc);
//     }

//     // 2. Fetch the chunk
//     const snapshot = await query.get();
    
//     if (snapshot.empty) {
//       hasMore = false;
//       break;
//     }

//     // 3. Stage batch operations
//     const batch = db.batch();
//     snapshot.docs.forEach(doc => {
//       const targetDocRef = targetRef.doc(doc.id);
//       batch.set(targetDocRef, doc.data());
//     });

//     // 4. Commit batch and update metrics
//     await batch.commit();
//     totalCopied += snapshot.size;
    
//     // Track the last document to anchor the next page
//     lastDoc = snapshot.docs[snapshot.docs.length - 1];

//     // If we fetched less than the limit, it was the final page
//     if (snapshot.size < BATCH_LIMIT) {
//       hasMore = false;
//     }
//   }

//   return totalCopied;
// }

// // Example Execution:
// // copyCollectionPaged('profiles', 'profiles_v2')
// //   .then(count => console.log(`Successfully migrated ${count} documents.`))
// //   .catch(console.error);
