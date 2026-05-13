import z from 'zod';
import { CONSTS } from '../../consts';

export const EffectSkillModifier = z.strictObject({
    type: z.literal(CONSTS.EFFECT_SKILL_MODIFIER).describe('fields.EffectType'),
    amp: z.number().int().describe('fields.amp'),
    skill: z.string(),
});
