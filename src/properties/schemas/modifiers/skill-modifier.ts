import z from 'zod';
import { SkillSchema } from '../../../schemas/enums/Skill';
import { CONSTS } from '../../../consts';

/**
 * This property modify a skill check
 */
export const PropertySkillModifier = z.strictObject({
    type: z.literal(CONSTS.PROPERTY_SKILL_MODIFIER),
    amp: z.number().int(), // ability modifier
    skill: SkillSchema, // what ability is modified
});
