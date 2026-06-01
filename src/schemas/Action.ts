import { z } from 'zod';
import { CooldownSchema } from '../libs/cooldown/Cooldown';
import { DISTANCE } from '../libs/distance';

export const ActionBlueprintSchema = z.strictObject({
    id: z.string().describe('ActionBlueprint.id'),
    hostile: z.boolean().describe('ActionBlueprint.hostile'),
    script: z.string().describe('ActionBlueprint.script'),
    cooldown: z.number().int().describe('ActionBlueprint.cooldown'),
    charges: z.number().int().describe('ActionBlueprint.charges'),
    range: z.enum(DISTANCE).describe('ActionBlueprint.range'),
    bonus: z.boolean().describe('ActionBlueprint.bonus'),
}).describe('ActionBlueprint');

export type ActionBlueprint = z.infer<typeof ActionBlueprintSchema>;

export const ActionStateSchema = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    range: z.enum(DISTANCE),
    cooldown: CooldownSchema,
    bonus: z.boolean(),
});

export type ActionState = z.infer<typeof ActionStateSchema>;
