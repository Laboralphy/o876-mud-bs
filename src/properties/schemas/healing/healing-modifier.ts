import z from 'zod';
import { CONSTS } from '../../../consts';
import { AmpExpressionSchema } from '../../../schemas/AmpExpression';

/**
 * Represents the configuration for a healing modifier property.
 * A healing modifier property modifies the healing output value of a creature.
 * example : 1d6 will increase the healing output by 1 to 6 points
 *
 * The amp field may be either a fixed int or a dice expression.
 *
 * This variable defines the structure of a healing modifier object
 * using a schema validation library.
 */
export const PropertyHealingModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_HEALING_MODIFIER),
    amp: AmpExpressionSchema,
});
