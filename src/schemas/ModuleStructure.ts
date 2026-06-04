import { z } from 'zod';
import { CreatureBlueprintSchema } from './CreatureBlueprint';
import { ItemBlueprintSchema } from './ItemBlueprint';
import { CreatureActionScriptSchema } from './CreatureActionScript';

export const ModuleStructureSchema = z.object({
    blueprints: z.record(z.string(), CreatureBlueprintSchema.or(ItemBlueprintSchema)).optional(),
    thinkers: z.record(z.string(), CreatureActionScriptSchema).optional(),
    actions: z.record(z.string(), CreatureActionScriptSchema).optional(),
});

export type ModuleStructure = z.infer<typeof ModuleStructureSchema>;
