import { buildStore } from './store';
import { GetterOutput } from '@laboralphy/reactor';
import { GetterReturnFunctions } from './store/define-getters';
import { State } from './store/state';
import { Attack } from './Attack';
import { Dice } from './libs/dice';
import { Property } from './properties/schemas';
import { clamp } from './libs/clamp';
import { propertyPrograms } from './properties/programs';
import { effectPrograms } from './effects/programs';
import { IProgram } from './interfaces/IProgram';
import { Effect } from './effects/schemas';
import { DamageType } from './schemas/enums/DamageType';

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

    private _iterateThroughPropertiesAndEffects(
        propCallback: (prop: Property, prog: IProgram<Property>) => void,
        effCallback: (effect: Effect, prog: IProgram<Effect>) => void
    ): void {
        for (const prop of this.getters.getActiveProperties) {
            propCallback(prop, propertyPrograms.get(prop.type)!);
        }
        for (const effect of this.getters.getActiveEffects) {
            effCallback(effect, effectPrograms.get(effect.type)!);
        }
    }

    /**
     * Each turn this method is called to reflect Creature's elapsing time
     */
    triggerMutateEvent() {
        // get all creature properties
        // for each prop, check if a mutate program is registered
        // run mutate program if registered
        this._iterateThroughPropertiesAndEffects(
            (prop, propProg) => {
                if (propProg.mutate) {
                    propProg.mutate(prop, this);
                }
            },
            (effect, effProg) => {
                if (effProg.mutate) {
                    effProg.mutate(effect, this);
                }
            }
        );
    }

    /**
     * This method is called whenever the creature is delivering an attack to its target
     */
    triggerAttackEvent(attack: Attack) {
        this._iterateThroughPropertiesAndEffects(
            (prop, propProg) => {
                if (propProg.attack) {
                    propProg.attack(prop, attack);
                }
            },
            (effect, effProg) => {
                if (effProg.attack) {
                    effProg.attack(effect, attack);
                }
            }
        );
    }

    /**
     * This method is called whenever the creature is attacked, attack being either miss or hit
     */
    triggerAttackedEvent(attack: Attack) {
        this._iterateThroughPropertiesAndEffects(
            (prop, propProg) => {
                if (propProg.attacked) {
                    propProg.attacked(prop, attack);
                }
            },
            (effect, effProg) => {
                if (effProg.attacked) {
                    effProg.attacked(effect, attack);
                }
            }
        );
    }

    /**
     * This method is called whenever the creature is damaged
     */
    triggerDamagedEvent(amount: number, damageType: DamageType, source: Creature | undefined) {
        this._iterateThroughPropertiesAndEffects(
            (prop, propProg) => {
                if (propProg.damaged) {
                    propProg.damaged(prop, amount, damageType, this, source);
                }
            },
            (effect, effProg) => {
                if (effProg.damaged) {
                    effProg.damaged(effect, amount, damageType, this, source);
                }
            }
        );
    }

    /**
     * This method is called whenever the creature is inflicting damage to its target
     */
    triggerDamageEvent(amount: number, damageType: DamageType, target: Creature) {
        this._iterateThroughPropertiesAndEffects(
            (prop, propProg) => {
                if (propProg.damage) {
                    propProg.damage(prop, amount, damageType, this, target);
                }
            },
            (effect, effProg) => {
                if (effProg.damage) {
                    effProg.damage(effect, amount, damageType, this, target);
                }
            }
        );
    }

    get hitPoints(): number {
        return clamp(this._hitpoints, 0, this.getters.getMaxHitPoints);
    }

    /** Clamped between 0 and max hitpoints */
    set hitPoints(value: number) {
        this._hitpoints = clamp(value, 0, this.getters.getMaxHitPoints);
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
