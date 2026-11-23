
import { ticketService } from "../services/ticketService.js";

export async function listTickets(req, res, next) {
  try {
    const tickets = await ticketService.list();

    res.status(200).json({
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.getById(req.params.id);

    res.status(200).json({
      data: ticket
    });
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req, res, next) {
  try {
    const ticket = await ticketService.create(req.body);

    res
      .location(`/api/tickets/${ticket.id}`)
      .status(201)
      .json({
        data: ticket
      });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketService.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      data: ticket
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(req, res, next) {
  try {
    await ticketService.remove(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
