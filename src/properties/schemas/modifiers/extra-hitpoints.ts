import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * The maximum hitpoints is increased to a fixed amount.
 */
export const PropertyExtraHitpoints = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_EXTRA_HITPOINTS),
    amp: z.number().int().describe('PropertyExtraHitpoints.amp'),
}).describe('PropertyExtraHitpoints');
