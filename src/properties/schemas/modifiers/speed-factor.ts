import z from 'zod';
import { CONSTS } from '../../../consts';

export const PropertySpeedFactor = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SPEED_FACTOR),
    amp: z.number(),
});
