import z from 'zod';
import { CONSTS } from '../../../consts';
import { AilmentSchema } from '../../../schemas/enums/Ailment';
import { EffectSubtypeSchema } from '../../../schemas/enums/EffectSubtype';
import { AbilitySchema } from '../../../schemas/enums/Ability';
import { DiseaseSchema } from '../../../schemas/enums/Disease';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyAilment = z
    .strictObject({
        type: z.literal(CONSTS.PROPERTY_AILMENT),
        ailment: AilmentSchema.describe('PropertyAilment.ailment'),
        chance: z.number().int().min(1).max(20).describe('PropertyAilment.chance'),
        duration: z.number().int().optional().describe('PropertyAilment.duration'),
        subtype: EffectSubtypeSchema.describe('PropertyAilment.subtype'),
        dc: z.number().int().min(0).default(10).describe('PropertyAilment.dc'),
        amp: DiceExpression.optional().describe('PropertyAilment.amp'),
        ability: AbilitySchema.optional().describe('PropertyAilment.ability'),
        disease: DiseaseSchema.optional().describe('PropertyAilment.disease'),
    })
    .describe('PropertyAilment');
