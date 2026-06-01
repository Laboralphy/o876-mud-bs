import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { SpecieSchema } from '../../../schemas/enums/Specie';
import { AttackTypeSchema } from '../../../schemas/enums/AttackType';

/**
 * Armor class modifier
 * The AC modifier can be limited to a certain type of attack (melee, ranged)
 * a certain type of damage (usually physical, but modern of futuristic weapons can use force damage, or electric damage),
 * and a certain type of species
 */
export const PropertyArmorClassModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER),
    amp: z.number().int().describe('PropertyArmorClassModifier.amp'),
    attackType: AttackTypeSchema.optional().describe('PropertyArmorClassModifier.attackType'),
    damageType: DamageTypeSchema.optional().describe('PropertyArmorClassModifier.damageType'),
    specie: SpecieSchema.optional().describe('PropertyArmorClassModifier.specie'),
}).describe('PropertyArmorClassModifier');
