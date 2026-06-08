import { z } from 'zod';
import { CooldownSchema } from '../libs/cooldown/Cooldown';
import { DistanceSchema } from './enums/Distance';

export const ActionBlueprintBaseSchema = z.object({
    id: z.string().describe('ActionBlueprint.id'),
    hostile: z.boolean().describe('ActionBlueprint.hostile'),
    cooldown: z.number().int().describe('ActionBlueprint.cooldown'),
    charges: z.number().int().optional().default(1).describe('ActionBlueprint.charges'),
    range: DistanceSchema.describe('ActionBlueprint.range'),
    bonus: z.boolean().describe('ActionBlueprint.bonus'),
});

export const ActionStateSchema = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    range: DistanceSchema,
    cooldown: CooldownSchema,
    bonus: z.boolean(),
    config: z.record(z.string(), z.unknown()).optional().default({}),
});

export type ActionState = z.infer<typeof ActionStateSchema>;
