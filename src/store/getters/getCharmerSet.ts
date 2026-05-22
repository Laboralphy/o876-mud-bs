import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';

export function getCharmerSet(state: State, getters: GetterReturnType): Set<string> {
    return getters.getEffects
        .filter((e) => e.type === CONSTS.EFFECT_CHARM)
        .reduce((set, e) => set.add(e.source), new Set<string>());
}
