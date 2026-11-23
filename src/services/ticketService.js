import { AppError } from "../errors/AppError.js";
import { createTicketId, priorities, statuses } from "../domain/ticketRules.js";
import { ticketRepository } from "../repositories/ticketRepository.js";

async function list() {
  return ticketRepository.all();
}

async function getById(id) {
  const tickets = await ticketRepository.all();
  const ticket = tickets.find((item) => item.id === id);

  if (!ticket) {
    throw new AppError(
      404,
      "TICKET_NOT_FOUND",
      "Ticket no encontrado"
    );
  }

  return ticket;
}

async function create(input) {
  const { title, description, priority, requester } = input ?? {};

  if (
    !title ||
    !description ||
    !priority ||
    !requester ||
    !priorities.includes(priority)
  ) {
    throw new AppError(
      400,
      "INVALID_INPUT",
      "Datos de entrada incompletos o inválidos"
    );
  }

  const tickets = await ticketRepository.all();

  const ticket = {
    id: createTicketId(tickets),
    title,
    description,
    priority,
    status: "open",
    requester
  };

  tickets.push(ticket);
  await ticketRepository.save(tickets);

  return ticket;
}

async function update(id, patch = {}) {
  patch = patch ?? {};

  const tickets = await ticketRepository.all();
  const index = tickets.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new AppError(
      404,
      "TICKET_NOT_FOUND",
      "Ticket no encontrado"
    );
  }

  if (
    patch.priority !== undefined &&
    !priorities.includes(patch.priority)
  ) {
    throw new AppError(
      400,
      "INVALID_PRIORITY",
      "Prioridad inválida"
    );
  }

  if (
    patch.status !== undefined &&
    !statuses.includes(patch.status)
  ) {
    throw new AppError(
      400,
      "INVALID_STATUS",
      "Estado inválido"
    );
  }

  const allowed = [
    "title",
    "description",
    "priority",
    "status"
  ];

  const changes = Object.fromEntries(
    Object.entries(patch).filter(([key]) =>
      allowed.includes(key)
    )
  );

  if (Object.keys(changes).length === 0) {
    throw new AppError(
      400,
      "EMPTY_PATCH",
      "No hay campos permitidos para actualizar"
    );
  }

  tickets[index] = {
    ...tickets[index],
    ...changes
  };

  await ticketRepository.save(tickets);

  return tickets[index];
}

async function remove(id) {
  const tickets = await ticketRepository.all();
  const index = tickets.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new AppError(
      404,
      "TICKET_NOT_FOUND",
      "Ticket no encontrado"
    );
  }

  tickets.splice(index, 1);
  await ticketRepository.save(tickets);
}

export const ticketService = {
  list,
  getById,
  create,
  update,
  remove
};
