import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { AmpExpressionSchema } from '../../../schemas/AmpExpression';

/**
 * This Effect modifies to output damage of a certain type
 * The amp may be a dice expression
 */
export const EffectDamageModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_MODIFIER),
    amp: AmpExpressionSchema,
    damageType: DamageTypeSchema,
});
