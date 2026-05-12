import z from 'zod';
import { CONSTS } from '../../consts';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

/**
 * Makes the creature able to see in dark environments
 * In fact a creature with light Effect will negate the effects of darkness and low-light conditions.
 * Thus all creatures within the same room may benefit of this effect.
 */
export const EffectLight = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_LIGHT),
});
