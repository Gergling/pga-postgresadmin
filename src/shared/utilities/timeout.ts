export const wait = (delay: number) => new Promise(
  res => setTimeout(res, delay)
);
