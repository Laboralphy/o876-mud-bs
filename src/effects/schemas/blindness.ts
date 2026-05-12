import z from 'zod';
import { CONSTS } from '../../consts';

export const EffectBlindness = z.strictObject({
    type: z.literal(CONSTS.EFFECT_BLINDNESS),
});
