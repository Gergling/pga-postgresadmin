import { Temporal } from "@js-temporal/polyfill";
import { now } from "@/shared/utilities";
import { copyFileContents } from "@/main/shared";
import { getNeDbFileName } from "./utilities";

const getPad = (
  time: Temporal.ZonedDateTime, prop: keyof Temporal.ZonedDateTime
) => {
  const ext = time[prop]?.toString().padStart(2, '0');
  if (!ext) throw new Error(`Invalid property: ${prop.toString()}`);
  return ext;
};
const getExt = (
  time: Temporal.ZonedDateTime, prop: keyof Temporal.ZonedDateTime
) => `${prop.toString()}-${getPad(time, prop)}`;

/**
 * Takes a copy of the NeDB file and makes copies for the current hour of the day, the
 * current minute of the hour, and the current date.
 */
export const dumpNeDb = async (collectionName: string) => {
  const path = getNeDbFileName(collectionName);
  const time = now().toZonedDateTimeISO('UTC');
  const paths = ['minute', 'hour'].map(
    (prop) => `${path}.${getExt(time, prop as keyof Temporal.ZonedDateTime)}.db`
  );
  const day = ['year', 'month', 'day'].map(
    (prop) => getPad(time, prop as keyof Temporal.ZonedDateTime)
  ).join('-');
  const dailyPath = `${path}.${day}.db`;
  return Promise.all([...paths, dailyPath].map(
    (dest) => copyFileContents(path, dest)
  ));
};
