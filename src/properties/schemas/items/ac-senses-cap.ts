import z from 'zod';
import { CONSTS } from '../../../consts';

export const PropertyAcSensesCap = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_AC_SENSES_CAP),
        amp: z.number().int().min(0).describe('PropertyAcSensesCap.amp'),
    })
    .describe('PropertyAcSensesCap');
