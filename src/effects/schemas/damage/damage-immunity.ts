import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

/**
 * This Effect makes the creature immune to a certain type of damage
 */
export const EffectDamageImmunity = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DAMAGE_IMMUNITY),
    damageType: DamageTypeSchema,
});
