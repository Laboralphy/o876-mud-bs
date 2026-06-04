import { z } from 'zod';
import { CreatureActionScriptSchema } from './CreatureActionScript';

export const ModuleStructureSchema = z.object({
    blueprints: z.record(z.string(), z.unknown()).optional(),
    thinkers: z.record(z.string(), CreatureActionScriptSchema).optional(),
    actions: z.record(z.string(), CreatureActionScriptSchema).optional(),
});

export type ModuleStructure = z.infer<typeof ModuleStructureSchema>;
