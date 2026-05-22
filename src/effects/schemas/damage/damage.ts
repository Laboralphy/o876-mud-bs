import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
export const EffectDamage = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE),
    damageType: DamageTypeSchema,
    amp: z.number().int(),
});
