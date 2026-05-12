import z from 'zod';
import { CONSTS } from '../../consts';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

export const EffectInvisibility = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_INVISIBILITY),
});
