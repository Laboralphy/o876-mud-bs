import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * Represents the configuration for a healing factor Effect.
 * A healing factor Effect modifies the healing output value of a creature by multiplying it by a factor.
 * example : 0.5 will halve the healing output
 */
export const EffectHealingFactor = z.strictObject({
    type: z.literal(CONSTS.EFFECT_HEALING_FACTOR),
    amp: z.number().describe('fields.amp'),
});
