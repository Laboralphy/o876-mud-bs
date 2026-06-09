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
import { Effect, EffectDefinition } from './effects/schemas';
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
import { generateUniqueId } from './libs/unique-id';
import { Skill } from './schemas/enums/Skill';
import { DiceRoll } from './DiceRoll';
import { Ability } from './schemas/enums/Ability';
import { Threat } from './schemas/enums/Threat';
import { EffectSubtype } from './schemas/enums/EffectSubtype';
import { CooldownManager } from './libs/cooldown';
import { IRulesEngine } from './interfaces/IRulesEngine';
import { EffectContainer } from './libs/effect-container';
import { EquipmentContainer } from './libs/equipment-container';
import {
    rollSkill as _rollSkill,
    checkSkill as _checkSkill,
    checkSkillAgainst as _checkSkillAgainst,
    rollAbilityCheck as _rollAbilityCheck,
    checkResistance as _checkResistance,
    rollThreat as _rollThreat,
} from './libs/checks';
import {
    isWieldingLight as _isWieldingLight,
    hasDarkvision as _hasDarkvision,
    isInBrightLocation as _isInBrightLocation,
    getCreatureVisibility as _getCreatureVisibility,
} from './libs/visibility';

export class Creature {
    private readonly _store = buildStore();
    public readonly dice = new Dice();
    public readonly effectContainer = new EffectContainer(this);
    public readonly equipmentContainer = new EquipmentContainer(this);
    public ref: string = '';

    private _hitpoints: number = 1;
    public location: Location | null = null;
    protected _rules: IRulesEngine | null = null;

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

    set rules(m: IRulesEngine | null) {
        this._rules = m;
    }

    get rules(): IRulesEngine {
        if (this._rules) {
            return this._rules;
        } else {
            throw new Error(`Creature ${this.id} has no rules engine assigned`);
        }
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
        effCallback: (effect: Effect, prog: IProgram<Effect>) => void,
        effectsSource: Effect[] = this.getters.getEffectsWithProgram,
        propertiesSource: Property[] = this.getters.getPropertiesWithProgram
    ): void {
        for (const prop of propertiesSource) {
            propCallback(prop, propertyPrograms.get(prop.type)!);
        }
        for (const effect of effectsSource) {
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
            },
            this.getters.getActiveEffects,
            this.getters.getActiveProperties
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
        source: Creature | null = null,
        duration: number = 0,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        return this.effectContainer.apply(effectDefinition, source, duration, subtype, tag);
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
        return this.effectContainer.applyGroup(effectDefinitions, source, duration, subtype, tag);
    }

    removeEffect(effect: Effect, bIgnoreSiblings: boolean = false) {
        this.effectContainer.remove(effect, bIgnoreSiblings);
    }

    setEffectDuration(effect: Effect, duration: number) {
        this.effectContainer.setDuration(effect, duration);
    }

    depleteEffects() {
        this.effectContainer.deplete();
    }

    dispelEffect(effect: Effect) {
        this.effectContainer.dispel(effect);
    }

    removeDeadEffects() {
        this.effectContainer.removeDeadEffects();
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
        return _getCreatureVisibility(this, oTarget);
    }

    isWieldingLight(): boolean {
        return _isWieldingLight(this);
    }

    hasDarkvision(): boolean {
        return _hasDarkvision(this);
    }

    isInBrightLocation(): boolean {
        return _isInBrightLocation(this);
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
        return this.equipmentContainer.findEquippedItemSlot(item);
    }

    /**
     * Remove the item from the equipment list.
     * If the item is not equipped, exit.
     * @param item - The item to remove from the equipment list.
     * @param bypass - If true, bypasses the check for cursed items. Default is false.
     * @returns The outcome of the operation. @see constant group EQUI_ITEM_*
     */
    unequipItem(item: Item, bypass: boolean = false): EquipItemOutcome {
        return this.equipmentContainer.unequipItem(item, bypass);
    }

    equipItem(item: Item): {
        unequippedItem: Item | null;
        outcome: EquipItemOutcome;
        equippedItem: Item | null;
    } {
        return this.equipmentContainer.equipItem(item);
    }

    // ▗▄▄      ▄▖  ▄▖                   ▗▖        ▗▖          ▗▖
    // ▐▌▐▌▗▛▜▖ ▐▌  ▐▌ ▗▛▀▘     ▀▜▖▐▛▜▖ ▄▟▌    ▗▛▀ ▐▙▄ ▗▛▜▖▗▛▀ ▐▌▄ ▗▛▀▘
    // ▐▛█ ▐▌▐▌ ▐▌  ▐▌  ▀▜▖    ▗▛▜▌▐▌▐▌▐▌▐▌    ▐▌  ▐▌▐▌▐▛▀▘▐▌  ▐▛▙  ▀▜▖
    // ▝▘▝▘ ▀▀  ▀▀  ▀▀ ▝▀▀      ▀▀▘▝▘▝▘ ▀▀▘     ▀▀ ▝▘▝▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀
    // Rolls and checks

    /**
     * Just roll a 1D20 with a modifier equal to the specified skill
     * @param skill
     */
    rollSkill(skill: Skill): DiceRoll {
        return _rollSkill(this, skill);
    }

    checkSkillAgainst(skill: Skill, adversary: Creature, advSkill: Skill) {
        return _checkSkillAgainst(this, skill, adversary, advSkill);
    }

    checkSkill(skill: Skill, dc: number): boolean {
        return _checkSkill(this, skill, dc);
    }

    rollAbilityCheck(ability: Ability, dc: number): boolean {
        return _rollAbilityCheck(this, ability, dc);
    }

    checkResistance(threat: Threat, dc: number): boolean {
        return _checkResistance(this, threat, dc);
    }

    rollThreat(threat: Threat, offensiveAbility: Ability, target: Creature): boolean {
        return _rollThreat(this, threat, offensiveAbility, target);
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
            const actionState = this.state.actions[actionId];
            CooldownManager.pushTimer(actionState.cooldown);
            this.emit(CONSTS.EVENT_CREATURE_ACTION, {
                creature: this,
                actionId,
                script: actionState.script,
                target,
                config: actionState.config ?? {},
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
