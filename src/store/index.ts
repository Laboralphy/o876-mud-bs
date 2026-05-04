import { State, StateSchema } from './state';
import { GetterReturnFunctions, Getters } from './define-getters';
import { CONSTS } from '../consts';
import { ReactiveStore } from '@laboralphy/reactor';

export function buildStore(): ReactiveStore<State, GetterReturnFunctions> {
    const state: State = StateSchema.parse({
        abilities: {
            [CONSTS.ABILITY_BODY]: 10,
            [CONSTS.ABILITY_SENSE]: 10,
            [CONSTS.ABILITY_MIND]: 10,
            [CONSTS.ABILITY_PRESENCE]: 10,
        },
    });
    return new ReactiveStore(state, Getters);
}
