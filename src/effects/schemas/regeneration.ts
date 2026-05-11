import { CONSTS } from '../../consts';
import z from 'zod';
import { AmpExpressionSchema } from '../../schemas/AmpExpression';
import { DamageTypeSchema } from '../../schemas/enums/DamageType';
import { BaseEffectSchema } from '../../schemas/BaseEffect';

export const EffectRegenerationSchema = BaseEffectSchema.extend({
    type: z.literal(CONSTS.EFFECT_REGENERATION),
    amp: AmpExpressionSchema,
    vulnerabilities: z.array(DamageTypeSchema).optional(),
    useConstitutionModifier: z.boolean().optional().default(false),
    shutdown: z.number().int().optional().default(0),
    threshold: z.number().int().optional().default(1),
});

export type EffectRegeneration = z.infer<typeof EffectRegenerationSchema>;
