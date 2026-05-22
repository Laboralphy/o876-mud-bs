import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';

export type HealingEntry = {
    modifier: number;
    factor: number;
};

export function getHealingFactor(state: State, getters: GetterReturnType): HealingEntry {
    const modResult = aggregate(
        [CONSTS.EFFECT_HEALING_MODIFIER, CONSTS.PROPERTY_HEALING_MODIFIER],
        {},
        getters
    );
    const factResult = aggregate(
        [CONSTS.EFFECT_HEALING_FACTOR, CONSTS.PROPERTY_HEALING_FACTOR],
        {},
        getters
    );
    return {
        modifier: modResult.sum,
        factor: factResult.count > 0 ? factResult.sum : 1,
    };
}
