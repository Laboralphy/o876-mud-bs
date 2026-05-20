import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Skill, SkillSchema } from '../../schemas/enums/Skill';
import { Ability } from '../../schemas/enums/Ability';
import skillsData from '../../data/skills.json';

const skillAbilityMap = Object.fromEntries(
    Object.entries(skillsData).map(([skill, def]) => [skill, def.ability])
) as Record<string, Ability>;

export const getSkillValues = (
    state: State,
    getters: GetterReturnType
): Record<Skill, number> => {
    const modifiers = getters.getAbilityModifiers;
    const skillBonuses = getters.getSkillBonusValues;
    return Object.fromEntries(
        SkillSchema.options.map((skill: Skill) => [
            skill,
            skillBonuses[skill] + modifiers[skillAbilityMap[skill]],
        ])
    ) as Record<Skill, number>;
};
