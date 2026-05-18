import z from 'zod';
import { CONSTS } from '../../../consts';
import { AmpExpressionSchema } from '../../../schemas/AmpExpression';

export const EffectPoison = z.strictObject({
    type: z.literal(CONSTS.EFFECT_POISON),
    amp: AmpExpressionSchema,
    dc: z.number().int().min(0).optional().default(0),
});
