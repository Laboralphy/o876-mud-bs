import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectDarkvision = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DARKVISION),
});
