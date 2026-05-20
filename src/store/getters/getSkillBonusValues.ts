import { State } from '../state';
import { CONSTS } from '../../consts';
import { Skill, SkillSchema } from '../../schemas/enums/Skill';
import { aggregate } from '../../libs/aggregator';
import { GetterReturnType } from '../define-getters';
import { Effect } from '../../effects/schemas';
import { Property } from '../../properties/schemas';

/**
 * The skill bonus (for each skill) is computed by adding properties and effects.
 */
export const getSkillBonusValues = (
    state: State,
    getters: GetterReturnType
): Record<Skill, number> => {
    const result = aggregate(
        [CONSTS.PROPERTY_SKILL_MODIFIER, CONSTS.EFFECT_SKILL_MODIFIER],
        {
            effects: {
                discriminator: (pe: Effect) =>
                    pe.data.type === CONSTS.EFFECT_SKILL_MODIFIER ? pe.data.skill : '',
            },
            properties: {
                discriminator: (pe: Property) =>
                    pe.data.type === CONSTS.PROPERTY_SKILL_MODIFIER ? pe.data.skill : '',
            },
        },
        getters
    );
    return Object.fromEntries(
        SkillSchema.options.map((skill: Skill) => [skill, result.discriminator[skill]?.sum ?? 0])
    ) as Record<Skill, number>;
};
