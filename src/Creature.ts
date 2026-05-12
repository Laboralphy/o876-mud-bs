import { buildStore } from './store';
import { GetterOutput } from '@laboralphy/reactor';
import { GetterReturnFunctions } from './store/define-getters';
import { State } from './store/state';
import { Attack } from './Attack';
import { Dice } from './libs/dice';
import { Property, PropertySchema } from './properties/schemas';
import { clamp } from './libs/clamp';
import { propertyPrograms } from './properties/programs';
import { effectPrograms } from './effects/programs';
import { IProgram } from './interfaces/IProgram';
import { Effect } from './effects/schemas';
import { DamageType } from './schemas/enums/DamageType';
import { aggregate, AggregateOptions } from './libs/aggregator';
import { PropertyType } from './schemas/enums/PropertyType';
import { EffectType } from './schemas/enums/EffectType';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { CONSTS } from './consts';
import type { Location } from './libs/locations/Location';

export class Creature {
    private readonly _store = buildStore();
    public readonly dice = new Dice();

    private _hitpoints: number = 1;
    public location: Location | null = null;

    constructor(public readonly id: string) {}

    get getters(): GetterOutput<GetterReturnFunctions> {
        return this._store.getters;
    }

    get state(): State {
        return this._store.state;
    }

    // ▗▖   ▗▖   ▄▖                     ▄▖
    // ▐▌   ▄▖  ▟▙▖▗▛▜▖    ▗▛▀ ▐▌▐▌▗▛▀  ▐▌ ▗▛▜▖
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘    ▐▌  ▝▙▟▌▐▌   ▐▌ ▐▛▀▘
    // ▝▀▀▘ ▀▀  ▝▘  ▀▀      ▀▀ ▗▄▛  ▀▀  ▀▀  ▀▀
    // Life cycle

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
     * Will aggregate properties and return sum, min, max, and count
     * @param types - Types of properties or effects to aggregate.
     * @param options - Options to filter the properties to aggregate.
     * @returns An object containing aggregated values. @see AggregatorResult
     */
    aggregate(types: (EffectType | PropertyType)[], options: AggregateOptions) {
        return aggregate(types, options, this.getters);
    }

    // ▗▄▄▖  ▄▖  ▄▖         ▗▖                                          ▗▖
    // ▐▙▄  ▟▙▖ ▟▙▖▗▛▜▖▗▛▀ ▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘▐▌   ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘ ▝▘  ▝▘  ▀▀  ▀▀   ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Effect management

    // ▗▄▄                      ▗▖                                              ▗▖
    // ▐▌▐▌▐▛▜▖▗▛▜▖▐▛▜▖▗▛▜▖▐▛▜▖▝▜▛▘▐▌▐▌    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▛▀ ▐▌  ▐▌▐▌▐▙▟▘▐▛▀▘▐▌   ▐▌ ▝▙▟▌    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘  ▝▘   ▀▀ ▐▌   ▀▀ ▝▘    ▀▘▗▄▛     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Property management

    /**
     * adds a new innate property
     * @param property
     */
    addInnateProperty(property: Property): void {
        this.state.properties.push(PropertySchema.parse(property));
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

    /**
     * Returns true if this creature can detect its target
     * @param oTarget {Creature}
     * @return {string} CREATURE_VISIBILITY_*
     */
    getCreatureVisibility(oTarget: Creature): CreatureVisibility {
        if (oTarget === this) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE;
        }
        const mg = this.getters;
        const tg = oTarget.getters;
        const myEffects = mg.getEffectSet;
        const targetEffects = tg.getEffectSet;
        const bFog = this.location?.environments.has(CONSTS.ENVIRONMENT_FOG) ?? false;

        if (myEffects.has(CONSTS.EFFECT_BLINDNESS) || bFog) {
            // Blinded creatures, or creature in fog cannot see target
            return CONSTS.CREATURE_VISIBILITY_BLINDED;
        }
        if (
            targetEffects.has(CONSTS.EFFECT_INVISIBILITY) &&
            !myEffects.has(CONSTS.EFFECT_SEE_INVISIBILITY)
        ) {
            // Invisibility effect prevents target detection unless creature has see invisibility effect
            return CONSTS.CREATURE_VISIBILITY_INVISIBLE;
        }
        if (targetEffects.has(CONSTS.EFFECT_STEALTH)) {
            // Stealth effect prevents target detection
            return CONSTS.CREATURE_VISIBILITY_HIDDEN;
        }
        return this.isInBrightLocation()
            ? CONSTS.CREATURE_VISIBILITY_VISIBLE
            : CONSTS.CREATURE_VISIBILITY_DARKNESS;
    }

    /**
     * Return true if this creature is using a light source enlightening surroundings
     */
    isWieldingLight(): boolean {
        const mg = this.getters;
        const myEffects = mg.getEffectSet;
        const myProps = mg.getPropertySet;
        return myEffects.has(CONSTS.EFFECT_LIGHT) || myProps.has(CONSTS.PROPERTY_LIGHT);
    }

    /**
     * Return true if this creature is able to see in this room
     * That means, if this creature is
     * - not in a fog room
     * - not in a dark room
     * - in a dark room with a creature wielding light
     */
    isInBrightLocation(): boolean {
        const location = this.location;
        if (!location) {
            return false;
        }
        if (location.environments.has(CONSTS.ENVIRONMENT_FOG)) {
            return false;
        }
        if (location.environments.has(CONSTS.ENVIRONMENT_DARKNESS)) {
            for (const creature of location.creatures) {
                if (creature.isWieldingLight()) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
}
