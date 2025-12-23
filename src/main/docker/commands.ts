/* eslint-disable no-fallthrough */
import { spawn } from 'child_process';
import {
  DOCKER_PULL_POSTGRES_CHANNEL_DONE,
  DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS,
  DockerChecklistContainerStatus,
  DockerChecklistEngineStatus,
  DockerChecklistImageStatus,
  DockerChecklistName,
  DockerChecklistPhaseStates,
  DockerChecklistStatusViewItem,
  DockerChecklistSubscriptionParams,
  DockerContainerStatus,
  DockerEngineStates,
  DockerStatus } from '../../shared/docker-postgres/types';
import { runCommand } from '../commands/run';
import { DOCKER_CONTAINER_NAME, DOCKER_IMAGE_NAME } from './constants';
import { loadDatabaseServerCredentials, saveDatabaseServerCredentials } from './server';
import { DockerCommands } from './types';
import { CommandResponse, UncertainBoolean } from '../../shared/types';

export const runDockerInfo = async (): Promise<DockerStatus<DockerEngineStates>> => {
  const response = await runCommand('docker info');
  const { status, stderr } = response;

  if (stderr && stderr.indexOf('error during connect') > -1) {
    return {
      ...response,
      status: 'installed',
    };
  }

  if (stderr && stderr.indexOf('Docker Desktop is manually paused') > -1) {
    return {
      ...response,
      status: 'paused',
    };
  }

  if (status) {
    return {
      ...response,
      status: 'running',
    };
  }

  return {
    ...response,
    status: 'not-installed',
  };
}

export const runDockerImageInspect = (): Promise<DockerStatus> => runCommand('docker image inspect postgres');

// TODO: This is going to be format of the main thread part of an abstract command-running framework.
export const runDockerPullPostgres = (
  event: Electron.IpcMainInvokeEvent
): void => {
  const child = spawn('docker', ['pull', DOCKER_IMAGE_NAME]);

  // Send progress to the renderer
  child.stdout.on('data', (data) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS, data.toString());
  });

  // Send a completion message
  child.on('close', (code) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_DONE, { success: code === 0 });
  });

  // Handle any errors
  child.on('error', (err) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_DONE, { success: false, error: err.message });
  });
}

// TODO: Run one command and discern whether the container has been created AND whether it is running.
// docker inspect --format='{{.State.Running}}' ${DOCKER_CONTAINER_NAME}
export const runDockerInspect = async (): Promise<DockerContainerStatus> => {
  const experimental = true;
  const cmd = experimental
    ? `docker inspect --format={{.State.Running}} ${DOCKER_CONTAINER_NAME}`
    : `docker inspect --format='{{.State.Running}}' ${DOCKER_CONTAINER_NAME}`;
  const {
    error,
    status,
    stderr,
    stdout,
  } = await runCommand(cmd);
  if (status && stdout) {
    const isRunning = stdout.trim() === 'true' ? 'running' : 'stopped';
    console.log('Is container running:', isRunning, stdout.trim(), stdout.trim() === 'true');
    return {
      status: isRunning,
      stdout,
    };
  }
  return {
    status: 'missing',
    error,
    stderr,
    stdout,
  };
};

export const runDockerPSPostgres = async (): Promise<DockerStatus> => {
  const {
    error,
    status,
    stderr,
    stdout,
  } = await runCommand(`docker ps -a --filter "name=${DOCKER_CONTAINER_NAME}" --format "{{.Names}}: {{.Status}}"`);

  if (status && stdout) {
    // If the command was successful, and there's output, check if the container is running.
    const isRunning = stdout.includes(DOCKER_CONTAINER_NAME) && !stdout.includes('Exited');
    return {
      status: isRunning,
      stdout,
    };
  }

  // If the command failed or there's no output, return the error status.
  return {
    status: false,
    error,
    stderr,
    stdout,
  };
};

export const runDockerRunPostgres = async (): Promise<DockerStatus> => {
  const credentials = await loadDatabaseServerCredentials();

  if (!credentials) return Promise.resolve({ status: false, error: 'No database server credentials found' });

  const { password, port } = credentials;

  return runCommand(`docker run --name ${DOCKER_CONTAINER_NAME} -e POSTGRES_PASSWORD=${password} -p ${port}:${port} -d ${DOCKER_IMAGE_NAME}`);
};
export const runDockerStartPostgres = async (): Promise<DockerStatus> => {
  return runCommand(`docker start ${DOCKER_CONTAINER_NAME}`);
};

type PhaseStatusMapping = {
  container: {
    pending: DockerChecklistContainerStatus[];
    yes: DockerChecklistContainerStatus;
  };
  engine: {
    pending: DockerChecklistEngineStatus[];
    yes: DockerChecklistEngineStatus;
  };
  image: {
    pending: DockerChecklistImageStatus[];
    yes: DockerChecklistImageStatus;
  };
};
type DockerChecklistPhase = keyof PhaseStatusMapping;

const phaseStatusMapping: PhaseStatusMapping = {
  engine: {
    pending: ['checking', 'unknown'],
    yes: 'running',
  },
  image: {
    pending: ['checking', 'pulling', 'unknown'],
    yes: 'exists',
  },
  container: {
    pending: ['checking', 'unknown'],
    yes: 'running',
  },
};

const upsertChecklist = (
  statuses: DockerChecklistStatusViewItem[],
  item: DockerChecklistStatusViewItem,
): DockerChecklistStatusViewItem[] => {
  const existingItem = statuses.find((i) => i.name === item.name);
  if (existingItem) {
    return statuses.map((i) =>
      i.name === item.name ? { ...i, ...item } : i
    );
  }
  return [...statuses, item];
};

const updateChecklist = (
  statuses: DockerChecklistStatusViewItem[],
  phase: DockerChecklistPhase,
  phaseStatus: DockerChecklistSubscriptionParams['status'],
  description: string,
): DockerChecklistStatusViewItem[] => {
  const isContainerPhase = phase === 'container';
  const name: DockerChecklistName = isContainerPhase ? 'container-exists' : phase;
  const { pending, yes } = phaseStatusMapping[phase];
  const isPending = (pending as string[]).includes(phaseStatus);
  const isPositive = yes === phaseStatus;
  const status: UncertainBoolean = isPending
    ? 'unknown'
    : isPositive
      ? 'yes'
      : 'no';

  // TODO: Engine should be checked for installation, whether it's stopped
  // altogether (if not, the application is running, so... good), paused
  // (so resume) or running.
  // All of those need special function calls.
  if (isContainerPhase) {
    if (phaseStatus === 'missing') {
      return upsertChecklist(statuses, { description, name, status: 'no' });
    }

    return upsertChecklist(
      upsertChecklist(statuses, { name, status: 'yes' }),
      { description, name: 'container-running', status }
    );
  }

  return upsertChecklist(statuses, { description, name, status });
}

const isCompleted = (
  statuses: DockerChecklistStatusViewItem[]
) => statuses.filter(({ status }) => status === 'yes').length === 4;

const triggerSubscription = (
  params: DockerChecklistPhaseStates & CommandResponse,
  subscription: (update: DockerChecklistSubscriptionParams) => void,
  checklist: DockerChecklistStatusViewItem[],
  description?: string,
): DockerChecklistStatusViewItem[] => {
  const { phase, status } = params;
  // const checklist = getVisibleChecklist(phase, status, description);
  const updatedChecklist = updateChecklist(checklist, phase, status, description || '');
  // TODO: Derive whether completion has occurred via updatedChecklist.
  subscription({ ...params, checklist: updatedChecklist, isCompleted: isCompleted(updatedChecklist) });
  return updatedChecklist;
};

type DockerChecklistStep = {
  phase: DockerChecklistSubscriptionParams['phase'];
  status: DockerChecklistSubscriptionParams['status'];
  step: string;
  fnc: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any
  ) => Promise<Partial<{
    description: string;
    status: DockerChecklistSubscriptionParams['status'];
    nextStep: string;
  }>>;
};

const steps: DockerChecklistStep[] = [
  {
    phase: 'engine',
    status: 'checking',
    step: 'check-engine',
    fnc: async () => {
      const { status, ...info } = await runDockerInfo();
      return {
        status,
        // nextStep depends on status ofc
        // CommandResponse or whatever it is should be put in here somewhere
        // Optional description is already specified
      };
    },
  },
]

// console.log(steps)

// const reduceSteps = async () => {
//   let initialValue = {

//   };
//   // const configs = steps.
//   for (const { phase, status, step, fnc } of steps) {
//     const state = {}; // TODO: Actually make sure there is a state. Can "let" if necessary. We are containing the mess. COuld abstract an async reducer.
//     const latest = await fnc('dong');
//     // newState = { ...state, ...steteUpdates }
//   }
// };

export const subscribeToDockerChecklist = async (
  subscription: (update: DockerChecklistSubscriptionParams) => void,
  phase: DockerChecklistPhase = 'engine',
  checklist: DockerChecklistStatusViewItem[] = [],
) => {
  // const x = (c: DockerChecklistStatusViewItem[]) => checklist = updateChecklist(c, )
  // console.log('Starting checklist from phase:', phase);
  const checks: (() => Promise<boolean>)[] = [];
  switch (phase) {
    // Engine
    case 'engine':
      checks.push(async () => {
        checklist = triggerSubscription({ phase, status: 'checking' }, subscription, checklist);
        const { status, ...info } = await runDockerInfo();

        if (status === 'running') {
          checklist = triggerSubscription(
            {
              ...info,
              phase,
              status: 'running'
            },
            subscription,
            checklist,
            info.stdout
          );
          return true;
        }

        if (status === 'paused') {
          checklist = triggerSubscription({ ...info, phase, status: 'paused' }, subscription, checklist, info.stderr);
          return false;
        }

        if (status === 'not-installed') {
          checklist = triggerSubscription({ ...info, phase, status: 'not-installed' }, subscription, checklist, info.stderr);
          return false;
        }

        // TODO: Differentiate between not installed and not running.
        checklist = triggerSubscription({ ...info, phase, status: 'installed' }, subscription, checklist, info.stderr);
        return false;
      });

    // Image
    case 'image':
      checks.push(async () => {
        const phase: DockerChecklistPhase = 'image';
        checklist = triggerSubscription({ phase, status: 'checking' }, subscription, checklist);
        const { status, ...image } = await runDockerImageInspect();
        if (!status) {
          const child = spawn('docker', ['pull', DOCKER_IMAGE_NAME]);

          checklist = triggerSubscription({ ...image, phase, status: 'pulling' }, subscription, checklist, image.stderr || image.stdout);

          // Send progress to the renderer
          child.stdout.on('data', (data) => {
            checklist = triggerSubscription({ ...image, phase, status: 'pulling', stdout: data.toString() }, subscription, checklist, data.toString());
          });
    
          // Send a completion message
          child.on('close', (code) => {
            checklist = triggerSubscription({ ...image, phase, status: code === 0 ? 'exists' : 'error' }, subscription, checklist);
            subscribeToDockerChecklist(subscription, 'container', checklist);
          });
    
          // Handle any errors
          child.on('error', (err) => {
            checklist = triggerSubscription({ ...image, phase, status: 'error', error: err.message }, subscription, checklist, err.message);
          });
    
          return false;
        }

        checklist = triggerSubscription({ ...image, phase, status: 'exists' }, subscription, checklist);
        return true;
      });

    // Container
    case 'container':
      checks.push(async () => {
        const phase = 'container';
        checklist = triggerSubscription({ phase, status: 'checking' }, subscription, checklist);
        const container = await runDockerInspect();
        checklist = triggerSubscription({ ...container, phase }, subscription, checklist, container.stderr || container.stdout);
        if (container.status !== 'running') {
          checklist = triggerSubscription({ ...container, phase, status: 'checking' }, subscription, checklist, container.stderr || container.stdout);
          await (container.status === 'missing' ? runDockerRunPostgres : runDockerStartPostgres)();
          setTimeout(() => {
            subscribeToDockerChecklist(subscription, 'container', checklist);
          }, 500);
        }
        return false;
      });
  }

  for (const fnc of checks) {
    const result = await fnc();
    if (!result) break;
  }
}

export const getCommands = (): DockerCommands => ({
  loadDatabaseServerCredentials,
  saveDatabaseServerCredentials,
  subscribeToDockerChecklist,
});
