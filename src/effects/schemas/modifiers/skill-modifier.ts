import z from 'zod';
import { CONSTS } from '../../../consts';
import { SkillSchema } from '../../../schemas/enums/Skill';

export const EffectSkillModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SKILL_MODIFIER).describe('fields.EffectType'),
    amp: z.number().int().describe('fields.amp'),
    skill: SkillSchema,
});
