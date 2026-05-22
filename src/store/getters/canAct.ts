import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';

export function canAct(state: State, getters: GetterReturnType): boolean {
    const effects = getters.getEffectSet;
    return (
        !effects.has(CONSTS.EFFECT_PARALYSIS) &&
        !effects.has(CONSTS.EFFECT_PETRIFICATION) &&
        !effects.has(CONSTS.EFFECT_STUN)
    );
}
