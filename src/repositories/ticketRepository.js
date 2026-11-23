
import { readTickets, writeTickets } from "../data/fileStore.js";

async function all() {
  return readTickets();
}

async function save(tickets) {
  await writeTickets(tickets);
}

export const ticketRepository = {
  all,
  save
};
