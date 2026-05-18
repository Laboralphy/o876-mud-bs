import z from 'zod';
import { CONSTS } from '../../../consts';
import { AbilitySchema } from '../../../schemas/enums/Ability';

/**
 * This property modifies an ability check when used as a resistance,
 */
export const PropertyAbilityResistanceModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_ABILITY_RESISTANCE_MODIFIER),
    amp: z.number().int(),
    ability: AbilitySchema,
});
