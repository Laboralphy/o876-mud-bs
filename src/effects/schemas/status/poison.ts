import z from 'zod';
import { CONSTS } from '../../../consts';
export const EffectPoison = z.strictObject({
    type: z.literal(CONSTS.EFFECT_POISON),
    amp: z.number().int(),
    dc: z.number().int().min(0).optional(),
});
