import {
  CouncilVerdictGrid,
  DossierContainer,
  HeaderSection,
  Main,
  MemberSigil,
  VoteValue
} from "./Detail.style";
import { Slab } from "@/renderer/shared/base";
import { COLORS } from "@/renderer/shared/theme";
import { SafetyControl, TextField } from "@/renderer/shared/form";
import {
  COUNCIL_MEMBER,
  Task,
} from "@/shared/features/user-tasks";
import { TaskRune, useUserTask } from "../../shared";
import { useTaskDetail } from "./context";
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

export const TaskDetail = ({ task }: { task: Task }) => {
  const { getPropertyPersistenceStatus } = useTaskDetail();
  const { save } = useUserTask(task);

  return (
    <DossierContainer>
      <HeaderSection>
        <TaskRune task={task.envelope} rune={{ color: 'blood', size: 'large' }} />
        <span style={{ color: COLORS.bloodRed }}>
          [ {task.envelope.id?.slice(0, 8)} | {task.envelope.data.source.type} ]
        </span>
        <Slab scanLines={
          getPropertyPersistenceStatus('summary') === 'idle' ? 'none' : 'scroll'
        }>
          <SafetyControl
            control={<TextField
              label="Summary"
              onPersist={(summary) => save({ summary })}
              value={task.envelope.data.summary}
            />}
            display={task.envelope.data.summary}
          />
        </Slab>
      </HeaderSection>

      <Main>
        <section>
          <Slab scanLines={
            getPropertyPersistenceStatus('description') === 'idle' ? 'none' : 'scroll'
          }>
            <SafetyControl
              control={<TextField
                label="Description"
                onPersist={(description) => save({ description })}
                value={task.envelope.data.description}
              />}
              display={task.envelope.data.description}

            />
          </Slab>
          {/* <TaskDescriptionInput
            value={task.data.description}
            onPersist={(description) => updateTask({ description })}
            placeholder="Venting / Tactical Observations..."
            minRows={3}
          /> */}
        </section>

        <section>
          {/* <TaskStatus task={task} />
          <StatusControl task={task} /> */}
        </section>
      </Main>

      <h3>The Council's Verdict</h3>
      <CouncilVerdictGrid>
        {COUNCIL_MEMBER.map(member => (
          <MemberSigil key={member.name} color={member.color}>
            <label>{member.label}</label>
            <VoteValue>
              Imp: {task.envelope.data.votes.importance[member.name] || '?'}
            </VoteValue>
            <VoteValue>
              Mom: {task.envelope.data.votes.momentum[member.name] || '?'}
            </VoteValue>
          </MemberSigil>
        ))}
      </CouncilVerdictGrid>

      {/* Audit Trail - The Sacred History */}
      <section style={{ opacity: 0.6, fontSize: '0.8rem' }}>
        // TODO: Audit Be Brúke(TM).
        <h4 style={{ color: COLORS.bloodRed }}>// HISTORY</h4>
        {task.envelope.audit.map((entry, i) => (
          <div key={i}>Manifested: {entry.updated.toString()} - </div>
        ))}
      </section>
    </DossierContainer>
  );
};
