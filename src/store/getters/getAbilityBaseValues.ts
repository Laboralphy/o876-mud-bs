import { State } from '../state';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';

/**
 * The abilities base values, without any bonus
 * @param state
 */
export const getAbilityBaseValues = (state: State): Record<Ability, number> => {
    return {
        [CONSTS.ABILITY_BODY]: state.abilities[CONSTS.ABILITY_BODY],
        [CONSTS.ABILITY_SENSE]: state.abilities[CONSTS.ABILITY_SENSE],
        [CONSTS.ABILITY_MIND]: state.abilities[CONSTS.ABILITY_MIND],
        [CONSTS.ABILITY_PRESENCE]: state.abilities[CONSTS.ABILITY_PRESENCE],
    };
};
