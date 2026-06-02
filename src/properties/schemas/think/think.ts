import { z } from 'zod';
import { CONSTS } from '../../../consts';

export const PropertyThink = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_THINK),
    script: z.string().describe('PropertyThink.script'),
}).describe('PropertyThink');
