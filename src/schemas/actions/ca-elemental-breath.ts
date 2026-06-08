import { z } from 'zod';
import { ActionBlueprintBaseSchema } from '../Action';
import { DamageTypeSchema } from '../enums/DamageType';
import { DiceExpression } from '../DiceExpression';

export const CaElementalBreathActionSchema = ActionBlueprintBaseSchema.extend({
    script: z.literal('ca-elemental-breath'),
    damageType: DamageTypeSchema,
    amp: DiceExpression,
});

export const CaElementalBreathConfigSchema = CaElementalBreathActionSchema.pick({
    damageType: true,
    amp: true,
});

export type CaElementalBreathConfig = z.infer<typeof CaElementalBreathConfigSchema>;
