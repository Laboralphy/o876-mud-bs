import z from 'zod';
import { Creature } from '../../Creature';

export const EventCombatPendingActionFailedSchema = z.strictObject({
    actionId: z.string(),
    target: z.instanceof(Creature).optional(),
    bonus: z.boolean(),
    reason: z.string(),
});

export type EventCombatPendingActionFailed = z.infer<typeof EventCombatPendingActionFailedSchema>;
