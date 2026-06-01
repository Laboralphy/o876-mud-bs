import z from 'zod';
import { CONSTS } from '../../../consts';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

/**
 * Adds a new damage type to a weapons.
 * Weapon with multiple damage types are less likely to hit the target. But when they hit they might deal more damage
 * by circumventing the resistance of the target.
 * For example: A target like ooze with crushing damage resistance will be hard to kill with a warhammer, but
 * will be killable with a bec de corbin (crushing + piercing damage) ; because the most efficient of the damage type
 * will be used to deal the most damage.
 * However when it comes to compute if a target is hit by a weapons, the best armor class is used against all damage types
 * provided by a weapons.
 */
export const PropertyExtraWeaponDamageType = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_EXTRA_WEAPON_DAMAGE_TYPE),
    damageType: DamageTypeSchema.describe('PropertyExtraWeaponDamageType.damageType'),
}).describe('PropertyExtraWeaponDamageType');
