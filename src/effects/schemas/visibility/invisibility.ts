import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectInvisibility = z.strictObject({
    type: z.literal(CONSTS.EFFECT_INVISIBILITY),
});
