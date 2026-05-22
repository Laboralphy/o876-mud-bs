import z from 'zod';
import { CONSTS } from '../../../consts';
export const EffectHeal = z.strictObject({
    type: z.literal(CONSTS.EFFECT_HEAL),
    amp: z.number().int(),
});
