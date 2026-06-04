import z from 'zod';
import { Creature } from '../../Creature';

export const EventCreatureRunScriptSchema = z.strictObject({
    scriptId: z.string(),
    creature: z.instanceof(Creature),
    target: z.instanceof(Creature).optional(),
});

export type EventCreatureRunScript = z.infer<typeof EventCreatureRunScriptSchema>;
