import { DiceExpression } from '@/schemas/DiceExpression';
import z from 'zod';
import { CONSTS } from '@/consts';

/**
 * This property modify a weapon damage output
 */
export const PropertyWeaponDamageModifier = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_WEAPON_DAMAGE_MODIFIER),
        amp: DiceExpression.describe('PropertyWeaponDamageModifier.amp'),
    })
    .describe('PropertyWeaponDamageModifier');
