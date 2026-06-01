import z from 'zod';
import { CONSTS } from '../../../consts';
import { AttackTypeSchema } from '../../../schemas/enums/AttackType';
import { SpecieSchema } from '../../../schemas/enums/Specie';

/**
 * Armor class modifier
 * The AC modifier can be limited to a certain type of attack (melee, ranged)
 * a certain type of damage (usually physical, but modern of futuristic weapons can use force damage, or electric damage),
 * and a certain type of species
 */
export const EffectAttackModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ATTACK_MODIFIER).describe('fields.EffectType'),
    amp: z.number().int().describe('fields.amp'),
    attackType: AttackTypeSchema.optional(),
    specie: SpecieSchema.optional(),
});
