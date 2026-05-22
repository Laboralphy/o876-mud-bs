import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectRoot = z.strictObject({
    type: z.literal(CONSTS.EFFECT_ROOT),
    dc: z.number().int().min(0).optional(),
});
