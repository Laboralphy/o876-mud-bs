import z from 'zod';
import { CONSTS } from '../../../consts';
import { AmpExpressionSchema } from '../../../schemas/AmpExpression';

export const EffectHeal = z.strictObject({
    type: z.literal(CONSTS.EFFECT_HEAL),
    amp: AmpExpressionSchema,
});
