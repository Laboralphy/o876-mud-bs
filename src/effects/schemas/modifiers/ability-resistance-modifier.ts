import z from 'zod';
import { CONSTS } from '../../../consts';
import { AbilitySchema } from '../../../schemas/enums/Ability';

/**
 * This effect modifies an ability check when used as a resistance,
 */
export const EffectAbilityResistanceModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ABILITY_RESISTANCE_MODIFIER),
    amp: z.number().int(),
    ability: AbilitySchema,
});
