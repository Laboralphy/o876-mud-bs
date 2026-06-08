import { RulesEngine } from '../RulesEngine';
import { Creature } from '../Creature';
import { z } from 'zod';

export const CreatureActionScriptSchema = z.function({
    input: [
        z.instanceof(RulesEngine),
        z.instanceof(Creature),
        z.instanceof(Creature).optional(),
        z.record(z.string(), z.unknown()).optional(),
    ],
    output: z.void(),
});

export type CreatureActionScript = z.infer<typeof CreatureActionScriptSchema>;
