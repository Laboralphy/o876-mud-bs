import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';
import { VARS } from '../../vars';

/**
 * Return the maximum hit points
 */
export const getMaxHitPoints = (state: State, getters: GetterReturnType) => {
    const abilities = getters.getAbilities;
    return abilities[CONSTS.ABILITY_BODY] * VARS.HITPOINTS_PER_BODY + VARS.HITPOINTS_BASE_VALUE;
};
