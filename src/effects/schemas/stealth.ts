import z from 'zod';
import { CONSTS } from '../../consts';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

export const EffectStealth = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_STEALTH),
});
