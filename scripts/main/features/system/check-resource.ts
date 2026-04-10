import { checkResources } from '@main/features/system';
import { wait } from '@shared/utilities/timeout';

const checkResource = async () => {
  console.log(await checkResources());
  await wait(1000);
  console.log(await checkResources());
  await wait(1000);
  console.log(await checkResources());
  await wait(1000);
  console.log(await checkResources());
};

console.log(checkResource());
