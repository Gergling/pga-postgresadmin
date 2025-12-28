import { firestore } from "firebase-admin";
import { EmailFragment } from "../../../shared/email/types";

export type FirebaseEmailFragment = Omit<EmailFragment, 'receivedAt'> & {
  receivedAt: {
    ms: number;
    db: firestore.Timestamp;
  };
};

type AddDocTypeMap = {
  diary_entries: {
    createdAt: number;
  };
  inbox_fragments: FirebaseEmailFragment;
};

type AddDocTypeMapAuditLog = {
  audit_log: {
    loggedTime: number;
    collectionName: keyof AddDocTypeMap;
  };
};

export type FirebaseCollectionName = keyof (AddDocTypeMap & AddDocTypeMapAuditLog);

export type FirebaseAddDoc = <
  CollectionName extends FirebaseCollectionName,
  DocType extends (AddDocTypeMap & AddDocTypeMapAuditLog)[CollectionName]
>(
  collectionName: CollectionName,
  fragment: DocType
) => Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>>;
