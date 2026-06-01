import z from 'zod';
import { CONSTS } from '../../../consts';

export const PropertyMaxSenseBonus = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_MAX_SENSE_BONUS),
    amp: z.number().int().min(0).describe('PropertyMaxSenseBonus.amp'),
}).describe('PropertyMaxSenseBonus');
