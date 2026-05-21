import z from 'zod';
import { Creature } from '../../Creature';
import { SkillSchema } from '../enums/Skill';

export const EventCreatureCheckSkillSchema = z.strictObject({
    creature: z.instanceof(Creature),
    skill: SkillSchema,
    dc: z.number().int(),
    success: z.boolean(),
});

export type EventCreatureCheckSkill = z.infer<typeof EventCreatureCheckSkillSchema>;
