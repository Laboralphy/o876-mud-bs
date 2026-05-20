import { State } from '../state';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';
import { aggregate } from '../../libs/aggregator';
import { GetterReturnType } from '../define-getters';
import { Effect } from '../../effects/schemas';
import { Property } from '../../properties/schemas';

/**
 * The ability bonus (for each ability) is computed by adding properties and effects.
 */
export const getAbilityBonusValues = (
    state: State,
    getters: GetterReturnType
): Record<Ability, number> => {
    const result = aggregate(
        [CONSTS.PROPERTY_ABILITY_MODIFIER, CONSTS.EFFECT_ABILITY_MODIFIER],
        {
            effects: {
                discriminator: (pe: Effect) =>
                    pe.type === CONSTS.EFFECT_ABILITY_MODIFIER ? pe.data.ability : '',
            },
            properties: {
                discriminator: (pe: Property) =>
                    pe.type === CONSTS.PROPERTY_ABILITY_MODIFIER ? pe.data.ability : '',
            },
        },
        getters
    );
    return {
        [CONSTS.ABILITY_BODY]: result.discriminator[CONSTS.ABILITY_BODY]?.sum ?? 0,
        [CONSTS.ABILITY_SENSES]: result.discriminator[CONSTS.ABILITY_SENSES]?.sum ?? 0,
        [CONSTS.ABILITY_MIND]: result.discriminator[CONSTS.ABILITY_MIND]?.sum ?? 0,
        [CONSTS.ABILITY_PRESENCE]: result.discriminator[CONSTS.ABILITY_PRESENCE]?.sum ?? 0,
    };
};
