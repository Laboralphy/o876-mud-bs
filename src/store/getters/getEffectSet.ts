import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { EffectType } from '../../schemas/enums/EffectType';
import { Effect } from '../../effects/schemas';

export function getEffectSet(state: State, getters: GetterReturnType): Set<EffectType> {
    return getters.getEffects.reduce(
        (prev: Set<EffectType>, curr: Effect) => prev.add(curr.type),
        new Set()
    );
}
