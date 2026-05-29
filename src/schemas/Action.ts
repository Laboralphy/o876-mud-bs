import { z } from 'zod';
import { CooldownSchema } from '../libs/cooldown/Cooldown';
import { DISTANCE } from '../libs/distance';

export const ActionBlueprintSchema = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    cooldown: z.number().int(),
    charges: z.number().int(),
    range: z.enum(DISTANCE),
});

export type ActionBlueprint = z.infer<typeof ActionBlueprintSchema>;

export const ActionStateSchema = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    range: z.enum(DISTANCE),
    cooldown: CooldownSchema,
});

export type ActionState = z.infer<typeof ActionStateSchema>;
