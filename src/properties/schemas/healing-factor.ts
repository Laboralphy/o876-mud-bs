import z from 'zod';
import { CONSTS } from '../../consts';

/**
 * Represents the configuration for a healing factor property.
 * A healing factor property modifies the healing output value of a creature by multiplying it by a factor.
 * example : 0.5 will halve the healing output
 */
export const PropertyHealingFactor = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_HEALING_FACTOR),
    amp: z.number(),
});
