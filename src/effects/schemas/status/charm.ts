import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * This effect will attempt to charm the target
 * Because of the nature of the effect and the bond it requires
 * The target can be protected according to the charmer's specie
 * this effect is
 */
export const EffectCharm = z.strictObject({
    type: z.literal(CONSTS.EFFECT_CHARM),
});
