import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectParalysis = z.strictObject({
    type: z.literal(CONSTS.EFFECT_PARALYSIS),
});
