import z from 'zod';
import { CONSTS } from '../../../consts';
import { AttackTypeSchema } from '../../../schemas/enums/AttackType';
import { SpecieSchema } from '../../../schemas/enums/Specie';

/**
 * Armor class modifier
 * The attack modifier can be limited to a certain type of attack (melee, ranged)
 * a certain type of damage (usually physical, but modern of futuristic weapon can use force damage, or electric damage),
 * and a certain type of species
 */
export const PropertyAttackModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ATTACK_MODIFIER),
    amp: z.number().int(),
    attackType: AttackTypeSchema.optional(),
    specie: SpecieSchema.optional(),
});
