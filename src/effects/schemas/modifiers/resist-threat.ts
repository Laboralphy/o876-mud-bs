import z from 'zod';
import { CONSTS } from '../../../consts';
import { ThreatTypeSchema } from '../../../schemas/enums/ThreatType';

export const EffectResistThreat = z.strictObject({
    type: z.literal(CONSTS.EFFECT_RESIST_THREAT),
    amp: z.number().int(),
    threatType: ThreatTypeSchema,
});
