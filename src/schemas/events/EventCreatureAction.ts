import z from 'zod';
import { Creature } from '../../Creature';

export const EventCreatureActionSchema = z.strictObject({
    creature: z.instanceof(Creature),
    actionId: z.string(),
    target: z.instanceof(Creature).optional(),
    script: z.string(),
    config: z.record(z.string(), z.unknown()),
});

export type EventCreatureAction = z.infer<typeof EventCreatureActionSchema>;
