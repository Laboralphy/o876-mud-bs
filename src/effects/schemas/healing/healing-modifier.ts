import z from 'zod';
import { CONSTS } from '../../../consts';
export const EffectHealingModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_HEALING_MODIFIER),
    amp: z.number().int().describe('fields.amp'),
});
