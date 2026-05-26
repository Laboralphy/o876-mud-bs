import z from 'zod';
import { CONSTS } from '../../../consts';
import { DiceExpression } from '../../../schemas/DiceExpression';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
export const EffectPoison = z.strictObject({
    type: z.literal(CONSTS.EFFECT_POISON),
    amp: DiceExpression,
    damageType: DamageTypeSchema.optional().default(CONSTS.DAMAGE_TYPE_NECROTIC),
    dc: z.number().int().min(0).optional(),
    periodicity: z.number().int().min(1).optional().default(1),
    timer: z.number().int().min(0).optional().default(0),
});
