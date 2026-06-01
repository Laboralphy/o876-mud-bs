import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

/**
 * This property makes the creature resistant (50%) to a certain type of damage
 */
export const PropertyDamageResistance = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_RESISTANCE),
    damageType: DamageTypeSchema.describe('PropertyDamageResistance.damageType'),
}).describe('PropertyDamageResistance');
