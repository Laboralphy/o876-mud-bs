import z from 'zod';
import { CONSTS } from '../../consts';
import { DamageTypeSchema } from '../../schemas/enums/DamageType';
import { AmpExpressionSchema } from '../../schemas/AmpExpression';

/**
 * This Effect reduce damage of a certain type
 * The amp may be a dice expression
 */
export const EffectDamageReduction = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_REDUCTION),
    amp: AmpExpressionSchema,
    damageType: DamageTypeSchema,
});
