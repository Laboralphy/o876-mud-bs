import z from 'zod';
import { CONSTS } from '../../../consts';
import { AmpExpressionSchema } from '../../../schemas/AmpExpression';
import { DiseaseSchema } from '../../../schemas/enums/Disease';

export const EffectDisease = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DISEASE),
    amp: AmpExpressionSchema,
    dc: z.number().int().min(0).optional().default(0),
    disease: DiseaseSchema,
});
