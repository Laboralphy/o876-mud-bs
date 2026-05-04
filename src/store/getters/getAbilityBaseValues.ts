import { State } from '../state';
import { CONSTS } from '../../consts';

/**
 * The abilities base values, without any bonus
 * @param state
 */
export const getAbilityBaseValues = (state: State) => {
    return {
        [CONSTS.ABILITY_BODY]: state.abilities[CONSTS.ABILITY_BODY],
        [CONSTS.ABILITY_SENSE]: state.abilities[CONSTS.ABILITY_SENSE],
        [CONSTS.ABILITY_MIND]: state.abilities[CONSTS.ABILITY_MIND],
        [CONSTS.ABILITY_PRESENCE]: state.abilities[CONSTS.ABILITY_PRESENCE],
    };
};
