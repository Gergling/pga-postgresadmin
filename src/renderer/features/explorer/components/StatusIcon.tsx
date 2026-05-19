import { Error, Lock, LockOpen, QuestionMark } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { ExplorerLock } from "../hooks";

export const StatusIcon = ({ result }: { result: ExplorerLock; }) => {
  switch (result) {
    case 'error': return <Error />;
    case 'loading': return <CircularProgress />;
    case 'open': return <LockOpen />;
    case 'unknown': return <QuestionMark />;
    default: return <Lock />;
  }
}
