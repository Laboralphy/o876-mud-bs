import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';
import BASE_HIT_POINTS from '../../data/creature-base-hit-points.json';

export const getMaxHitPoints = (state: State, getters: GetterReturnType) => {
    const abilities = getters.getAbilityModifiers;
    const { base, perBody } = BASE_HIT_POINTS[getters.getSize];
    return abilities[CONSTS.ABILITY_BODY] * perBody + base;
};
