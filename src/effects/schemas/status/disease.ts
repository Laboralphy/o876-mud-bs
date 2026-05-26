import z from 'zod';
import { CONSTS } from '../../../consts';
import { DiseaseSchema } from '../../../schemas/enums/Disease';

export const EffectDisease = z.strictObject({
    type: z.literal(CONSTS.EFFECT_DISEASE),
    amp: z.number().int().optional().default(0), // rolled duration of the current stage, set by the program
    dc: z.number().int().min(0).optional(), // each stage, target may resist with body to get rid of disease
    disease: DiseaseSchema,
    stage: z.number().int().min(0).optional().default(0),
    timer: z.number().int().min(0).optional().default(0),
});
