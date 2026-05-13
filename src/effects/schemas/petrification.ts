import z from 'zod';
import { CONSTS } from '../../consts';

export const EffectPetrification = z.strictObject({
    type: z.literal(CONSTS.EFFECT_PETRIFICATION),
    amp: z.number().int().positive().optional().default(1),
});
