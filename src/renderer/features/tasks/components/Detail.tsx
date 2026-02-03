import { useEffect } from "react";
import { COUNCIL_MEMBER } from "../../../../shared/features/user-tasks";
import { useNavigationRegister } from "../../../shared/navigation";
import { UiUserTask } from "../types";
import {
  CouncilVerdictGrid,
  DossierContainer,
  HeaderSection,
  Main,
  MemberSigil,
  VoteValue
} from "./Detail.style";
import { StatusControl } from "./StatusControl";
import { TaskStatus } from "./Status";
import { getTaskHistoryItem } from "../utilities/route";
import { useUserTasks } from "../context";
import { TaskRune } from "./Rune";
// import { Link } from "@mui/material";

// const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// TODO: user_tasks should absolutely be a shared/ constant.
// const getFirebaseUrl = (
//   taskId: string
// ) => `https://console.firebase.google.com/u/0/project/${projectId}/firestore/data/user_tasks/${taskId}`;

// // https://console.firebase.google.com/u/0/project/{VITE_FIREBASE_PROJECT_ID}/firestore/databases/-default-/data/~2F{collectionName}~2F{recordId}

// const FirebaseLink = ({ taskId }: { taskId: string | undefined }) => {
//   if (!taskId) return 'No task id';

//   const href = getFirebaseUrl(taskId).slice(0, 8);

//   console.log(href)

//   return <Link
//     href={href}
//     // target="_blank"
//     // rel="noopener noreferrer"
//     underline="none"
//   >{taskId}</Link>;
// };

// TODO: Audit log will require some attention.
// It will need to display what has 

export const TaskDetail = ({ task }: { task: UiUserTask<true> }) => {
  const { register } = useNavigationRegister();
  const { activeTab } = useUserTasks();

  useEffect(() => {
    register(getTaskHistoryItem(task, activeTab.name));
  }, [activeTab.name, register, task]);

  return (
    <DossierContainer>
      <HeaderSection>
        <TaskRune task={task} rune={{ color: 'blood', size: 'large' }} />
        <span style={{ color: '#700' }}>[ {task.id?.slice(0, 8)} | {task.source.type} ]</span>
        <h1>{task.summary}</h1>
      </HeaderSection>

      <Main>
        <section>
          <p>{task.description}</p>
        </section>

        <section>
          <TaskStatus task={task} />
          <StatusControl task={task} />
        </section>
      </Main>

      <h3>The Council's Verdict</h3>
      <CouncilVerdictGrid>
        {COUNCIL_MEMBER.map(member => (
          <MemberSigil key={member.id} color={member.color}>
            <label>{member.label}</label>
            <VoteValue>
              Imp: {task.votes.importance[member.id] || '?'}
            </VoteValue>
            <VoteValue>
              Mom: {task.votes.momentum[member.id] || '?'}
            </VoteValue>
          </MemberSigil>
        ))}
      </CouncilVerdictGrid>

      {/* Audit Trail - The Sacred History */}
      <section style={{ opacity: 0.6, fontSize: '0.8rem' }}>
        <h4 style={{ color: '#700' }}>// HISTORY</h4>
        {task.audit.map((entry, i) => (
          <div key={i}>Manifested: {new Date(task.updated).toLocaleString()}</div>
        ))}
      </section>
    </DossierContainer>
  );
};
