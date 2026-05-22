import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
export const EffectDamageReduction = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_REDUCTION),
    amp: z.number().int(),
    damageType: DamageTypeSchema,
});
