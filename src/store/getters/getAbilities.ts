import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';

/**
 * The abilities modifier values
 */
export const getAbilities = (state: State, getters: GetterReturnType): Record<Ability, number> => {
    const bv = getters.getAbilityBonusValues;
    return {
        [CONSTS.ABILITY_BODY]: state.abilities[CONSTS.ABILITY_BODY] + bv[CONSTS.ABILITY_BODY],
        [CONSTS.ABILITY_SENSE]: state.abilities[CONSTS.ABILITY_SENSE] + bv[CONSTS.ABILITY_SENSE],
        [CONSTS.ABILITY_MIND]: state.abilities[CONSTS.ABILITY_MIND] + bv[CONSTS.ABILITY_MIND],
        [CONSTS.ABILITY_PRESENCE]:
            state.abilities[CONSTS.ABILITY_PRESENCE] + bv[CONSTS.ABILITY_PRESENCE],
    };
};
