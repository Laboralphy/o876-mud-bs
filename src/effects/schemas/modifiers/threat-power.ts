import z from 'zod';
import { CONSTS } from '../../../consts';
import { ThreatSchema } from '../../../schemas/enums/Threat';

export const EffectThreatPower = z.strictObject({
    type: z.literal(CONSTS.EFFECT_THREAT_POWER).describe('fields.EffectType'),
    threat: ThreatSchema.describe('fields.threat'),
    amp: z.number().int().describe('fields.amp'),
});
