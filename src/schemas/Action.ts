import { z } from 'zod';
import { CooldownSchema } from './Cooldown';

export const ActionDefinition = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    cooldown: z.number().int(),
    charges: z.number().int(),
});

export const ActionState = z.strictObject({
    id: z.string(),
    hostile: z.boolean(),
    script: z.string(),
    cooldown: CooldownSchema,
});
