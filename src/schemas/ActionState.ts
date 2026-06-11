import { z } from 'zod';
import { CooldownSchema } from '../libs/cooldown/Cooldown';
import { DistanceSchema } from './enums/Distance';

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
