import { CONSTS } from '../../consts';
import { AbilitySchema } from '../../schemas/enums/Ability';
import z from 'zod';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

/**
 * This effect increase the bonus applied to an ability check
 */
export const EffectAbilityModifier = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_ABILITY_MODIFIER),
    amp: z.number().int(),
    ability: AbilitySchema,
});
