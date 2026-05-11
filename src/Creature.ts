import { buildStore } from './store';
import { GetterOutput } from '@laboralphy/reactor';
import { GetterReturnFunctions } from './store/define-getters';
import { State } from './store/state';
import { CONSTS } from './consts';
import { Attack } from './Attack';
import { Dice } from './libs/dice';
import { Property } from './properties/schemas';

export class Creature {
    private readonly _store = buildStore();
    public readonly dice = new Dice();

    private _hitpoints: number = 1;

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

    /**
     * Return the creature maximum hitpoints
     */
    getHitPoints(): number {
        return this._hitpoints;
    }

    /**
     * Sets the new amount of hitpoints a creature has.
     * This value is clamped between 0 and max hitpoints
     * @param value
     */
    setHitPoints(value: number) {
        this._hitpoints = Math.max(0, Math.min(value, this.getters.getMaxHitPoints));
    }

    /**
     * Modifies hitpoints, but not below 0 or above max hitpoints
     * @param delta amount of hitpoints added (if positive) or subtracted (if negative)
     */
    modifyHitPoints(delta: number): void {
        this.setHitPoints(this.getHitPoints() + delta);
    }

    /**
     * adds a new innate property
     * @param property
     */
    addInnateProperty(property: Property): void {
        this.state.properties.push(property);
    }

    /**
     * Remove an innate property
     * @param property
     */
    removeInnateProperty(property: Property): void {
        const i = this.state.properties.indexOf(property);
        if (i >= 0) {
            this.state.properties.splice(i, 1);
        }
    }
}
