import z from 'zod';
import { Creature } from '../../Creature';

export const EventCreatureHealSchema = z.strictObject({
    creature: z.instanceof(Creature),
    amount: z.number().int().min(0),
    healer: z.instanceof(Creature).optional(),
});

export type EventCreatureHeal = z.infer<typeof EventCreatureHealSchema>;
