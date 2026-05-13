import z from 'zod';
import { CONSTS } from '../../consts';
import { DamageTypeSchema } from '../../schemas/enums/DamageType';

/**
 * This property makes the creature immune to a certain type of damage
 */
export const PropertyDamageImmunity = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_DAMAGE_IMMUNITY),
    damageType: DamageTypeSchema,
});
