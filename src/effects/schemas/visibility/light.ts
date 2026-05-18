import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * Makes the creature able to see in dark environments
 * In fact a creature with light Effect will negate the effects of darkness and low-light conditions.
 * Thus all creatures within the same room may benefit of this effect.
 */
export const EffectLight = z.strictObject({
    type: z.literal(CONSTS.EFFECT_LIGHT),
});
