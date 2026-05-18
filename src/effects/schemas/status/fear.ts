import z from 'zod';
import { CONSTS } from '../../../consts';

/**
 * This effect will attempt to frighten the target
 * Because of the nature of the effect and the bond it requires
 * The target can be protected according to the attacker's specie
 */
export const EffectFear = z.strictObject({
    type: z.literal(CONSTS.EFFECT_FEAR),
});
