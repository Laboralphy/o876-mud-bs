import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

/**
 * This Effect makes the creature resistant (50%) to a certain type of damage
 */
export const EffectDamageResistance = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_RESISTANCE),
    damageType: DamageTypeSchema,
});
