import z from 'zod';
import { Creature } from '../../Creature';

export const EventCreatureDeathSchema = z.strictObject({
    creature: z.instanceof(Creature),
    killer: z.instanceof(Creature).optional(),
});

export type EventCreatureDeath = z.infer<typeof EventCreatureDeathSchema>;
