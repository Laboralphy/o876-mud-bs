import { Manager } from '../Manager';
import { Creature } from '../Creature';
import { z } from 'zod';

export const CreatureActionScriptSchema = z.function({
    input: [z.instanceof(Manager), z.instanceof(Creature), z.instanceof(Creature).optional()],
    output: z.void(),
});

export type CreatureActionScript = z.infer<typeof CreatureActionScriptSchema>;
