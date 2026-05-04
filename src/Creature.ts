import { buildStore } from './store';
import { GetterOutput } from '@laboralphy/reactor';
import { GetterReturnFunctions } from './store/define-getters';
import { State } from './store/state';
import { CONSTS } from './consts';
import { Attack } from './Attack';

export class Creature {
    private readonly _store = buildStore();
    constructor(public readonly id: string) {}

    get getters(): GetterOutput<GetterReturnFunctions> {
        return this._store.getters;
    }

    get state(): State {
        return this._store.state;
    }

    /**
     * Each turn this method is called to reflect Creature's elapsing time
     */
    triggerMutateEvent() {}

    /**
     * This method is called whenever the creature is delivering an attack to its target
     */
    triggerAttackEvent(attack: Attack) {}

    /**
     * This method is called whenever the creature is attacked, attack being either miss or hit
     */
    triggerAttackedEvent(attack: Attack) {}

    /**
     * This method is called whenever the creature is damaged
     */
    triggerDamagedEvent() {}
}
