import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * Represents the configuration for a speed factor Effect.
 * A speed factor Effect modifies the speed output value of a creature by multiplying it by a factor.
 * example : 0.5 will halve the speed output ; 2 will double it ; 1.5 will add 50% to the creature's base speed
 */
export const EffectSpeedFactor = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SPEED_FACTOR),
    amp: z.number().describe('fields.amp'),
});
