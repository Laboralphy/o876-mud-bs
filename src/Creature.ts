import { buildStore } from './store';
import { GetterOutput } from '@laboralphy/reactor';
import { GetterReturnFunctions } from './store/define-getters';
import { State } from './store/state';
import { Attack } from './Attack';
import { Dice } from './libs/dice';
import { Property, PropertyDefinition } from './properties/schemas';
import { PropertyBuilder } from './builders/PropertyBuilder';
import { clamp } from './libs/clamp';
import { propertyPrograms } from './properties/programs';
import { effectPrograms } from './effects/programs';
import { IProgram } from './interfaces/IProgram';
import { Effect, EffectDefinition, EffectSchema } from './effects/schemas';
import { DamageType } from './schemas/enums/DamageType';
import { aggregate, AggregateOptions } from './libs/aggregator';
import { PropertyType } from './schemas/enums/PropertyType';
import { EffectType } from './schemas/enums/EffectType';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { CONSTS } from './consts';
import { Location, LocationRegistry } from './libs/locations';
import { Item } from './schemas/Item';
import { EquipmentSlot } from './schemas/enums/EquipmentSlot';
import EventEmitter from 'node:events';
import { EquipItemOutcome } from './schemas/enums/EquipItemOutcome';
import { EventCreatureRemoveItemFailed } from './schemas/events/EventCreatureRemoveItemFailed';
import { EventCreatureRemoveItem } from './schemas/events/EventCreatureRemoveItem';
import { EventCreatureEquipItemFailed } from './schemas/events/EventCreatureEquipItemFailed';
import { EventCreatureEquipItem } from './schemas/events/EventCreatureEquipItem';
import { EventCreatureCheckSkill } from './schemas/events/EventCreatureCheckSkill';
import { EventCreatureCheckResistance } from './schemas/events/EventCreatureCheckResistance';
import { generateUniqueId } from './libs/unique-id';
import { Skill } from './schemas/enums/Skill';
import { DiceRoll } from './DiceRoll';
import { Ability } from './schemas/enums/Ability';
import { randomUUID } from 'node:crypto';
import { EffectSubtype } from './schemas/enums/EffectSubtype';
import { EventEffectProcessorImmunity } from './schemas/events/EventEffectProcessorImmunity';
import { EventEffectProcessorCreatureEffect } from './schemas/events/EventEffectProcessorCreatureEffect';
import { getImmunityRules } from './libs/get-immunity-rules';
import { CooldownManager } from './libs/cooldown';
import { IManager } from './interfaces/IManager';

export class Creature {
    private readonly _store = buildStore();
    public readonly dice = new Dice();
    public ref: string = '';

    private _hitpoints: number = 1;
    public location: Location | null = null;
    public manager: IManager | null = null;

    get registry(): LocationRegistry | null {
        return this.location?.registry ?? null;
    }
    public readonly events = new EventEmitter();
    public group: number = 0; // Creature of the same group can be affected by Area Of Effect spells

    constructor(public readonly id: string = generateUniqueId()) {}

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

    emit<T>(event: string, payload: T): boolean {
        return this.events.emit(event, payload);
    }

    /**
     * Effects are mutated and their duration are decreased
     * Dead effect are removed as a side effect.
     */
    process() {
        this.state.actionTaken = false;
        this.state.bonusActionTaken = false;
        this.triggerMutateEvent();
        this.depleteEffects();
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
                    propProg.mutate(prop, this, undefined);
                }
            },
            (effect, effProg) => {
                if (effProg.mutate) {
                    effProg.mutate(effect, this, this.registry?.getCreature(effect.source));
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
        this.emit(CONSTS.EVENT_CREATURE_DAMAGED, { creature: this, amount, damageType, source });
        if (this.hitPoints <= 0) {
            this.emit(CONSTS.EVENT_CREATURE_DEATH, { creature: this, killer: source });
        }
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

    // ▗▖▗▖ ▗▖  ▗▖      ▄▖                   ▗▖         ▗▖ ▗▖               ▗▖       ▗▖ ▗▖          ▗▖
    // ▐▌▐▌ ▄▖ ▝▜▛▘ ▀▜▖ ▐▌ ▗▛▀▘     ▀▜▖▐▛▜▖ ▄▟▌    ▗▛▜▖▝▜▛▘▐▙▄ ▗▛▜▖▐▛▜▖     ▄▖ ▐▛▜▖ ▄▟▌ ▄▖ ▗▛▀  ▀▜▖▝▜▛▘▗▛▜▖▐▛▜▖▗▛▀▘
    // ▝▙▟▘ ▐▌  ▐▌ ▗▛▜▌ ▐▌  ▀▜▖    ▗▛▜▌▐▌▐▌▐▌▐▌    ▐▌▐▌ ▐▌ ▐▌▐▌▐▛▀▘▐▌       ▐▌ ▐▌▐▌▐▌▐▌ ▐▌ ▐▌  ▗▛▜▌ ▐▌ ▐▌▐▌▐▌   ▀▜▖
    //  ▝▘  ▀▀   ▀▘ ▀▀▘ ▀▀ ▝▀▀      ▀▀▘▝▘▝▘ ▀▀▘     ▀▀   ▀▘▝▘▝▘ ▀▀ ▝▘       ▀▀ ▝▘▝▘ ▀▀▘ ▀▀  ▀▀  ▀▀▘  ▀▘ ▀▀ ▝▘  ▝▀▀

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

    /**
     * Apply an effect to the creature.
     * The effect will be added to the creature's effects list.
     * The effect will be triggered each round.
     * The effect will be removed from the creature's effects list when it expires.
     * @param effectDefinition - The definition of the effect to apply.
     * @param source - The source of the effect.
     * @param duration - The duration of the effect in rounds.
     * @param subtype - The subtype of the effect.
     * @param tag - A tag to identify the effect.
     * @returns The newly created effect.
     * The newly created effect may be modified to adding siblings, setting effect subtype, etc.
     * See EffectSchema for more details.
     */
    applyEffect(
        effectDefinition: EffectDefinition,
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        const effect: Effect = EffectSchema.parse({
            type: effectDefinition.type,
            data: effectDefinition,
            id: randomUUID(),
            source: source.id,
            target: this.id,
            duration,
            subtype,
            tag,
            siblings: [],
        });
        let immune: boolean = getImmunityRules(effect, this.getters.getImmunities);
        this.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, {
            creature: this,
            effect,
            immune: (b: boolean) => {
                immune = b;
            },
        });
        if (!immune) {
            if (duration > 0) {
                this.state.effects.push(effect);
            }
            this.emit<EventEffectProcessorCreatureEffect>(
                CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                {
                    creature: this,
                    effect,
                }
            );
            const prog = effectPrograms.get(effect.type);
            if (prog?.apply) {
                prog.apply(effect, this, source);
            }
        }
        return effect;
    }

    /**
     * Apply an effect group to the creature.
     * For all effect definition specified, the corresponding effect will be created and added to the creature's effects
     * list unless the creature is immune to the effect.
     *
     * @param effectDefinitions - The definitions of all effects in the groupe.
     * @param source - The source of the effect.
     * @param duration - The duration of the effect in rounds.
     * @param subtype - The subtype of the effect.
     * @param tag - A tag to identify the effect.
     */
    applyEffectGroup(
        effectDefinitions: EffectDefinition[],
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect[] {
        const aEffectIds: string[] = [];
        const aEffects: Effect[] = [];
        for (const effectDefinition of effectDefinitions) {
            const effect: Effect = EffectSchema.parse({
                type: effectDefinition.type,
                data: effectDefinition,
                id: randomUUID(),
                source: source.id,
                target: this.id,
                duration,
                subtype,
                tag,
                siblings: aEffectIds,
            });
            let immune: boolean = false;
            this.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, {
                creature: this,
                effect,
                immune: () => {
                    immune = true;
                },
            });
            if (!immune) {
                aEffectIds.push(effect.id);
                aEffects.push(effect);
                this.state.effects.push(effect);
                this.emit<EventEffectProcessorCreatureEffect>(
                    CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                    {
                        creature: this,
                        effect,
                    }
                );
            }
        }
        return aEffects;
    }

    /**
     * Remove an effect from the creature's effects list.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to remove from the creature's effects list.
     * @param bIgnoreSiblings - If true, the effect will be removed, but its siblings will not be removed.
     * If false (default value), the effect and its siblings will be removed.
     */
    removeEffect(effect: Effect, bIgnoreSiblings: boolean = false) {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === effect.id);
        if (effIndex >= 0) {
            // effect was found in the effects list
            const effect = this.state.effects[effIndex];
            if (!bIgnoreSiblings) {
                // remove siblings
                effect.siblings.forEach((siblingId: string) => {
                    const sibling = this.findEffectById(siblingId);
                    if (sibling) {
                        // Remove this sibling, but ignore the sibling's siblings
                        this.removeEffect(sibling, true);
                    }
                });
                // all siblings have been removed, remove the effect itself
                this.removeEffect(effect, true);
                return;
            }
            const source = this.registry?.getCreature(effect.source);
            this.emit<EventEffectProcessorCreatureEffect>(
                CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED,
                {
                    creature: this,
                    effect,
                }
            );
            const prog = effectPrograms.get(effect.type);
            if (prog?.dispose) {
                prog.dispose(effect, this, source);
            }
            this.state.effects.splice(effIndex, 1);
        }
    }

    /**
     * Get an effect from the creature's effects list.
     * If the effect is not found in the creature's effects list, returns undefined.
     * The effect is the Reactive Version of the effect. That means that modifying effect will trigger reactive systeme
     * Thus this function is private.
     * This function works as a sort of type guard.
     * The "Effect" management function set should not throw error when dealing with incorrect effect,
     * to act like NWN : when trying to dispel an effect that does not exist, nothing happens.
     * @param idEffect {string} - The id of the effect to retrieve.
     * @return The instance of the effect with the specified id, or undefined if not found.
     */
    private findEffectById(idEffect: string): Effect | undefined {
        const effIndex = this.state.effects.findIndex((eff: Effect) => eff.id === idEffect);
        return effIndex >= 0 ? this.state.effects[effIndex] : undefined;
    }

    /**
     * Set the duration of an effect.
     * If the effect is not found in the creature's effects list, exit.
     * @param effect - The effect to modify.
     * @param duration - The new duration of the effect.
     */
    setEffectDuration(effect: Effect, duration: number) {
        const effFound = this.findEffectById(effect.id);
        if (effFound) {
            effFound.duration = duration;
        }
    }

    /**
     * Decrease each effect duration by 1.
     * Effects that expire will be removed from the creature's effects list.
     * This method should be called each round.
     */
    depleteEffects() {
        for (const effect of this.state.effects) {
            --effect.duration;
        }
        this.removeDeadEffects();
    }

    /**
     * Dispel an effect. Actually set the duration of the effect to 0.
     * The effect will be removed from the creature's effects list.'
     * @param effect - effect to be dispelled
     */
    dispelEffect(effect: Effect) {
        this.setEffectDuration(effect, 0);
    }

    /**
     * Removes all effects with expired duration from the creature's state.
     * Iterates backwards through the effects array to safely remove effects whose duration has reached or fallen below 0.
     */
    removeDeadEffects() {
        let i = this.state.effects.length - 1;
        while (i >= 0) {
            if (this.state.effects[i].duration <= 0) {
                this.removeEffect(this.state.effects[i], true);
            }
            --i;
        }
    }

    // ▗▄▄                      ▗▖                                              ▗▖
    // ▐▌▐▌▐▛▜▖▗▛▜▖▐▛▜▖▗▛▜▖▐▛▜▖▝▜▛▘▐▌▐▌    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▛▀ ▐▌  ▐▌▐▌▐▙▟▘▐▛▀▘▐▌   ▐▌ ▝▙▟▌    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘  ▝▘   ▀▀ ▐▌   ▀▀ ▝▘    ▀▘▗▄▛     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Property management

    /**
     * adds a new innate property
     * @param property
     */
    addInnateProperty(property: PropertyDefinition): void {
        this.state.properties.push(PropertyBuilder.buildProperty(property));
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

    // ▗▖▗▖ ▗▖      ▗▖ ▗▖   ▗▖  ▄▖  ▗▖  ▗▖                      ▗▖
    // ▐▌▐▌ ▄▖ ▗▛▀▘ ▄▖ ▐▙▄  ▄▖  ▐▌  ▄▖ ▝▜▛▘▐▌▐▌    ▗▛▀▘▐▌▐▌▗▛▀▘▝▜▛▘▗▛▜▖▐▙▟▙
    // ▝▙▟▘ ▐▌  ▀▜▖ ▐▌ ▐▌▐▌ ▐▌  ▐▌  ▐▌  ▐▌ ▝▙▟▌     ▀▜▖▝▙▟▌ ▀▜▖ ▐▌ ▐▛▀▘▐▛▛█
    //  ▝▘  ▀▀ ▝▀▀  ▀▀ ▝▀▀  ▀▀  ▀▀  ▀▀   ▀▘▗▄▛     ▝▀▀ ▗▄▛ ▝▀▀   ▀▘ ▀▀ ▝▘ ▀
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
            return CONSTS.CREATURE_VISIBILITY_HIDDEN;
        }
        if (this.isInBrightLocation()) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE;
        }
        if (this.location?.environments.has(CONSTS.ENVIRONMENT_DARKNESS) && this.hasDarkvision()) {
            return CONSTS.CREATURE_VISIBILITY_VISIBLE;
        }
        return CONSTS.CREATURE_VISIBILITY_DARKNESS;
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

    hasDarkvision(): boolean {
        const mg = this.getters;
        return (
            mg.getEffectSet.has(CONSTS.EFFECT_DARKVISION) ||
            mg.getPropertySet.has(CONSTS.PROPERTY_DARKVISION)
        );
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

    // ▗▄▄▖ ▗▖              ▟▜▖                 ▗▖                  ▗▖                                          ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙     ▟▛     ▗▛▜▖▗▛▜▌▐▌▐▌ ▄▖ ▐▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█    ▐▌▜▛    ▐▛▀▘▝▙▟▌▐▌▐▌ ▐▌ ▐▙▟▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀     ▀▘▀     ▀▀   ▐▌ ▀▀▘ ▀▀ ▐▌  ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘

    /**
     * Returns the slot where the item is equipped
     * @param item - The item to find the slot of.
     * @returns The slot where the item is equipped, or undefined if the item is not equipped.
     */
    findEquippedItemSlot(item: Item): EquipmentSlot | undefined {
        const itemId = item.id;
        for (const s in this._store.state.equipment) {
            const slot = s as EquipmentSlot;
            const slotItemId = this._store.state.equipment[slot]?.id ?? '';
            if (slotItemId === itemId) {
                return slot;
            }
        }
        return undefined;
    }

    /**
     * Remove the item from the equipment list.
     * If the item is not equipped, exit.
     * @param item - The item to remove from the equipment list.
     * @param bypass - If true, bypasses the check for cursed items. Default is false.
     * @returns The outcome of the operation. @see constant group EQUI_ITEM_*
     */
    unequipItem(item: Item, bypass: boolean = false): EquipItemOutcome {
        const slot = this.findEquippedItemSlot(item);
        // Check if item is really equipped
        if (!slot) {
            // Item not equipped : exit
            this.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED;
        }
        // Check if item is cursed (skipped when bypass is true)
        if (
            !bypass &&
            this.aggregate([CONSTS.PROPERTY_CURSED], {
                restrictSlots: [slot],
            }).count > 0
        ) {
            // Item is cursed and cannot be removed
            this.emit<EventCreatureRemoveItemFailed>(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, {
                creature: this,
                item,
                slot,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT,
            });
            return CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT;
        }
        // Item is equipped and not cursed (or bypass): it can be safely removed
        this._store.state.equipment[slot] = null;
        this.emit<EventCreatureRemoveItem>(CONSTS.EVENT_CREATURE_REMOVE_ITEM, {
            creature: this,
            item,
            slot,
        });
        return CONSTS.EQUIP_ITEM_SUCCESS;
    }

    /**
     * Remove item currently equipped in the given slot. If no item is equipped in this slot, exit.
     * @param slot - The slot to remove the item from.
     * @returns An object containing the outcome of the operation and the item that has been removed from the slot.
     * The operation may failed if the item in the specified slot is cursed
     */
    private unequipSlot(slot: EquipmentSlot): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
    } {
        const item = this._store.state.equipment[slot];
        if (!item) {
            // No item equipped in this slot
            // Cannot fire Creature Remove Item Failed event because no referenced item (slot is empty)
            return {
                unequippedItem: null,
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED,
            };
        }
        const outcome = this.unequipItem(item);
        return {
            unequippedItem: outcome === CONSTS.EQUIP_ITEM_SUCCESS ? item : null,
            outcome,
        };
    }

    /**
     * Equip the item in the first available slot.
     * If no slot is available, unequip items in other slots until an available slot is found.
     * @param item - The item to equip.
     * @returns An object containing the outcome of the operation and the item that has been equipped.
     * The operation may fail if the item currently equipped in the slot is cursed
     * and cannot be replaced by the new item.
     */
    equipItem(item: Item): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
        equippedItem: Item | null;
    } {
        const slots = item.equipmentSlots;
        if (slots.length === 0) {
            // Cannot equip this item: fits in no slot
            this.emit<EventCreatureEquipItemFailed>(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                creature: this,
                item,
                reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
            });
            return {
                outcome: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT,
                unequippedItem: null,
                equippedItem: null,
            };
        }
        // get the first slot available
        const availableSlot: EquipmentSlot | undefined = slots.find(
            (slot) => !this._store.state.equipment[slot]
        );
        if (availableSlot) {
            // Available slot identified ; no previous item to unequip
            this._store.state.equipment[availableSlot] = item;
            this.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                item: this._store.state.equipment[availableSlot],
                creature: this,
                slot: availableSlot,
            });
            return {
                unequippedItem: null,
                outcome: CONSTS.EQUIP_ITEM_SUCCESS,
                equippedItem: this._store.state.equipment[availableSlot],
            };
        } else {
            // No available slot: must remove item prior to equip the new one
            let lastOutcome: EquipItemOutcome = CONSTS.EQUIP_ITEM_SUCCESS;
            for (const slot of slots) {
                const eqo = this.unequipSlot(slot);
                if (eqo.outcome === CONSTS.EQUIP_ITEM_SUCCESS) {
                    // an item of one of the suitable slots has been unequipped
                    // use this very slot to equip the new item
                    // ann exit with success
                    this._store.state.equipment[slot] = item;
                    this.emit<EventCreatureEquipItem>(CONSTS.EVENT_CREATURE_EQUIP_ITEM, {
                        item: this._store.state.equipment[slot],
                        creature: this,
                        slot: slot,
                    });
                    return {
                        unequippedItem: eqo.unequippedItem,
                        outcome: CONSTS.EQUIP_ITEM_SUCCESS,
                        equippedItem: this._store.state.equipment[slot],
                    };
                } else {
                    lastOutcome = eqo.outcome;
                }
            }
            // Could not find an available slot, even after attempting to unequip items
            // Exit
            this.emit<EventCreatureEquipItemFailed>(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, {
                creature: this,
                item,
                reason: lastOutcome,
            });
            return {
                outcome: lastOutcome,
                unequippedItem: null,
                equippedItem: null,
            };
        }
    }

    // ▗▄▄      ▄▖  ▄▖                   ▗▖        ▗▖          ▗▖
    // ▐▌▐▌▗▛▜▖ ▐▌  ▐▌ ▗▛▀▘     ▀▜▖▐▛▜▖ ▄▟▌    ▗▛▀ ▐▙▄ ▗▛▜▖▗▛▀ ▐▌▄ ▗▛▀▘
    // ▐▛█ ▐▌▐▌ ▐▌  ▐▌  ▀▜▖    ▗▛▜▌▐▌▐▌▐▌▐▌    ▐▌  ▐▌▐▌▐▛▀▘▐▌  ▐▛▙  ▀▜▖
    // ▝▘▝▘ ▀▀  ▀▀  ▀▀ ▝▀▀      ▀▀▘▝▘▝▘ ▀▀▘     ▀▀ ▝▘▝▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Rolls and checks

    rollSkill(skill: Skill): DiceRoll {
        return new DiceRoll('1d20', this.getters.getSkillValues[skill]);
    }

    checkSkillAgainst(skill: Skill, adversary: Creature, advSkill: Skill) {
        const meDice = this.rollSkill(skill);
        const advDice = adversary.rollSkill(advSkill);
        const success = meDice.total >= advDice.total;
        this.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
            creature: this,
            skill,
            dc: advDice.total,
            success,
        });
        adversary.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
            creature: adversary,
            skill: advSkill,
            dc: meDice.total + 1,
            success: advDice.total >= meDice.total + 1,
        });
        return success;
    }

    checkSkill(skill: Skill, dc: number): boolean {
        const d = new DiceRoll('1d20', this.getters.getSkillValues[skill], dc);
        this.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
            creature: this,
            skill,
            dc,
            success: d.success,
        });
        return d.success;
    }

    checkResistance(ability: Ability, dc: number): boolean {
        const d = new DiceRoll('1d20', this.getters.getAbilityModifiers[ability], dc);
        this.emit<EventCreatureCheckResistance>(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, {
            creature: this,
            ability,
            dc,
            success: d.success,
        });
        return d.success;
    }

    //  ▗▖      ▗▖  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Actions

    doAction(actionId: string, target: Creature | undefined) {
        const action = this.getters.getActions.find((a) => a.id === actionId);
        if (action) {
            if (!action.ready) {
                return {
                    success: false,
                    reason: 'ACTION_FAILED_NOT_READY',
                };
            }
            if (action.bonus) {
                this.state.bonusActionTaken = true;
            } else {
                this.state.actionTaken = true;
            }
            CooldownManager.pushTimer(this.state.actions[actionId].cooldown);
            this.emit(CONSTS.EVENT_CREATURE_ACTION, {
                creature: this,
                actionId,
                script: action.script,
                target,
            });
            return {
                success: true,
                reason: '',
            };
        } else {
            return {
                success: false,
                reason: 'ACTION_FAILED_NOT_AVAILABLE',
            };
        }
    }
}
