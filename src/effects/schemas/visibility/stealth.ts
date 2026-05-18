import z from 'zod';
import { CONSTS } from '../../../consts';

export const EffectStealth = z.strictObject({
    type: z.literal(CONSTS.EFFECT_STEALTH),
});
