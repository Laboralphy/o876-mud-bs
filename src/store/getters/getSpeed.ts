import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';

export function getSpeed(state: State, getters: GetterReturnType): number {
    if (getters.getEffectSet.has(CONSTS.EFFECT_ROOT)) {
        return 0;
    }
    const base = state.speed;
    if (base === 0) {
        return 0;
    }
    const speedEffects = getters.getEffects.filter((e) => e.type === CONSTS.EFFECT_SPEED_FACTOR);
    const speedProperties = [
        ...getters.getInnateProperties,
        ...getters.getEquipmentProperties,
    ].filter((p) => p.type === CONSTS.PROPERTY_SPEED_FACTOR);

    let factor = 1;
    for (const e of speedEffects) {
        factor *= (e.data as { amp: number }).amp;
    }
    for (const p of speedProperties) {
        factor *= (p.data as { amp: number }).amp;
    }
    return Math.floor(base * factor);
}
