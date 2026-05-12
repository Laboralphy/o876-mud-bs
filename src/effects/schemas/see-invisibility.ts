import z from 'zod';
import { CONSTS } from '../../consts';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

export const EffectSeeInvisibility = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_SEE_INVISIBILITY),
});
