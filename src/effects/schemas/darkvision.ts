import z from 'zod';
import { CONSTS } from '../../consts';

/**
 * Makes the creature able to see in dark environments
 */
export const EffectDarkvision = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DARKVISION),
});
