import { CONSTS } from '../../../consts';
import z from 'zod';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';

export const EffectRegeneration = z.strictObject({
    type: z.literal(CONSTS.EFFECT_REGENERATION),
    amp: z.number().int(),
    vulnerabilities: z.array(DamageTypeSchema).optional(),
    useConstitutionModifier: z.boolean().optional().default(false),
    shutdown: z.number().int().optional().default(0),
    threshold: z.number().int().optional().default(1),
});
