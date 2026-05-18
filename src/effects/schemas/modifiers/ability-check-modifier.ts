import z from 'zod';
import { CONSTS } from '../../../consts';
import { AbilitySchema } from '../../../schemas/enums/Ability';

/**
 * This effect modifies an ability check,
 */
export const EffectAbilityCheckModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ABILITY_CHECK_MODIFIER),
    amp: z.number().int(),
    ability: AbilitySchema,
});
