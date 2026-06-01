import z from 'zod';
import { CONSTS } from '../../../consts';
import { AbilitySchema } from '../../../schemas/enums/Ability';

/**
 * This property modifies an ability check,
 */
export const PropertyAbilityCheckModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_CHECK_MODIFIER),
    amp: z.number().int().describe('PropertyAbilityCheckModifier.amp'),
    ability: AbilitySchema.describe('PropertyAbilityCheckModifier.ability'),
}).describe('PropertyAbilityCheckModifier');
