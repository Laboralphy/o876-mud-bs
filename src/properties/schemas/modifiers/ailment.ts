import z from 'zod';
import { CONSTS } from '../../../consts';
import { AilmentTypeSchema } from '../../../schemas/enums/AilmentType';
import { EffectSubtypeSchema } from '../../../schemas/enums/EffectSubtype';
import { AbilitySchema } from '../../../schemas/enums/Ability';
import { DiseaseSchema } from '../../../schemas/enums/Disease';
import { DamageTypeSchema } from '../../../schemas/enums/DamageType';
import { DiceExpression } from '../../../schemas/DiceExpression';

export const PropertyAilment = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_AILMENT),
    ailmentType: AilmentTypeSchema.describe('PropertyAilment.ailmentType'),
    chance: z.number().int().min(1).max(20).describe('PropertyAilment.chance'),
    duration: z.number().int().min(1).describe('PropertyAilment.duration'),
    subtype: EffectSubtypeSchema.describe('PropertyAilment.subtype'),
    dc: z.number().int().min(0).default(10).describe('PropertyAilment.dc'),
    amp: z.union([z.number().int().positive(), DiceExpression]).optional().describe('PropertyAilment.amp'),
    ability: AbilitySchema.optional().describe('PropertyAilment.ability'),
    disease: DiseaseSchema.optional().describe('PropertyAilment.disease'),
    damageType: DamageTypeSchema.optional().describe('PropertyAilment.damageType'),
}).describe('PropertyAilment');
