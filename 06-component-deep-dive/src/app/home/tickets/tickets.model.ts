export type TicketStatus = 'open' | 'closed';

export const TICKET_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed'
} as const;

export type Ticket = {
    id: string;
    title: string;
    request: string;
    status: TicketStatus;
};