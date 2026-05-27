import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';

export function getSpeed(state: State, getters: GetterReturnType): number {
    if (getters.getEffectSet.has(CONSTS.EFFECT_ROOT)) {
        return 0;
    }
    return state.speed;
}
