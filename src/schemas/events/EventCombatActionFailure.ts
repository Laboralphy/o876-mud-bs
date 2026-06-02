import z from 'zod';
import { Creature } from '../../Creature';

export const EventCombatActionFailureSchema = z.strictObject({
    actionId: z.string(),
    target: z.instanceof(Creature).optional(),
    bonus: z.boolean(),
    reason: z.string(),
});

export type EventCombatActionFailure = z.infer<typeof EventCombatActionFailureSchema>;
