import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Ability, AbilitySchema } from '../../schemas/enums/Ability';
import { SkillSchema } from '../../schemas/enums/Skill';
import skillsData from '../../data/skills.json';

const skillAbilityMap = Object.fromEntries(
    Object.entries(skillsData).map(([skill, def]) => [skill, def.ability])
) as Record<string, string>;

export const getResistanceValues = (
    state: State,
    getters: GetterReturnType
): Record<Ability, number> => {
    const modifiers = getters.getAbilityModifiers;
    const skillBonuses = getters.getSkillBonusValues;
    return Object.fromEntries(
        AbilitySchema.options.map((ability: Ability) => {
            const skillSum = SkillSchema.options
                .filter(skill => skillAbilityMap[skill] === ability)
                .reduce((sum, skill) => sum + skillBonuses[skill], 0);
            return [ability, modifiers[ability] + skillSum];
        })
    ) as Record<Ability, number>;
};
