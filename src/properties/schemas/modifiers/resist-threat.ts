import z from 'zod';
import { CONSTS } from '../../../consts';
import { ThreatTypeSchema } from '../../../schemas/enums/ThreatType';

export const PropertyResistThreat = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_RESIST_THREAT),
    amp: z.number().int(),
    threatType: ThreatTypeSchema,
});
