import z from 'zod';
import { CONSTS } from '../../../consts';
import { ThreatSchema } from '../../../schemas/enums/Threat';

export const PropertyThreatPower = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_THREAT_POWER),
        threat: ThreatSchema.describe('PropertyThreatPower.threat'),
        amp: z.number().int().describe('PropertyThreatPower.amp'),
    })
    .describe('PropertyThreatPower');
