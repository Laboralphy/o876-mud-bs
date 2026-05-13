import z from 'zod';
import { CONSTS } from '../../consts';

/**
 * The maximum hitpoints is increased to a fixed amount.
 */
export const EffectExtraHitpoints = z.strictObject({
    type: z.literal(CONSTS.EFFECT_EXTRA_HITPOINTS).describe('fields.EffectType'),
    amp: z.number().int().describe('fields.amp'),
});
