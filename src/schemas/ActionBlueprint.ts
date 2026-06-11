import { z } from 'zod';
import { DistanceSchema } from './enums/Distance';

export const ActionBlueprintSchema = z.object({
    hostile: z.boolean().describe('ActionBlueprint.hostile'),
    script: z.string().describe('ActionBlueprint.script'),
    range: DistanceSchema.describe('ActionBlueprint.range'),
    config: z.record(z.string(), z.unknown()).optional().default({}),
});

export type ActionBlueprint = z.infer<typeof ActionBlueprintSchema>;
