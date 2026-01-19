import { Temporal } from "@js-temporal/polyfill";
import { ImapFlow } from "imapflow";

const getDate1MonthAgo = () => {
  const now = Temporal.Now.plainDateTimeISO();
  const oneMonthAgo = now.subtract({ months: 1 });
  return oneMonthAgo.toString();
}

export const fetchRecentEmailIds = async (client: ImapFlow) => {
  const since = getDate1MonthAgo();
  const list = await client.search({ since });
  console.log('list', list)
  if (!list || !list.length) return;

  const recentIds = list.slice(-10).reverse();
  console.log('recentIds', recentIds)
  return recentIds;
};

export const fetchEmail = async (
  client: ImapFlow,
  id: string
) => client.fetchOne(id, {
  envelope: true, 
  source: true,
  bodyStructure: true 
});
