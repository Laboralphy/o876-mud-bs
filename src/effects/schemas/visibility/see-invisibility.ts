import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectSeeInvisibility = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SEE_INVISIBILITY),
});
