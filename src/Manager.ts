import EventEmitter from 'node:events';
import { Creature } from './Creature';
import { Item } from './schemas/Item';
import { PropertyBuilder } from './builders/PropertyBuilder';
import { ItemBlueprint } from './schemas/ItemBlueprint';
import { ItemBuilder } from './builders/ItemBuilder';
import { Property, PropertyDefinition } from './properties/schemas';
import { Effect, EffectDefinition } from './effects/schemas';
import { ActionBlueprint, ActionState, ActionStateSchema } from './schemas/Action';
import { CooldownManager } from './libs/cooldown';
import { deepClone } from './libs/deep-clone';
import { CONSTS } from './consts';
import { EventEffectProcessorCreatureEffect } from './schemas/events/EventEffectProcessorCreatureEffect';
import { EventEffectProcessorImmunity } from './schemas/events/EventEffectProcessorImmunity';
import { EventCreatureEquipItem } from './schemas/events/EventCreatureEquipItem';
import { EventCreatureRemoveItem } from './schemas/events/EventCreatureRemoveItem';
import { EventCreatureEquipItemFailed } from './schemas/events/EventCreatureEquipItemFailed';
import { EventCreatureRemoveItemFailed } from './schemas/events/EventCreatureRemoveItemFailed';
import { EventCreatureCheckSkill } from './schemas/events/EventCreatureCheckSkill';
import { EventCreatureCheckResistance } from './schemas/events/EventCreatureCheckResistance';
import { EventCreatureDamaged } from './schemas/events/EventCreatureDamaged';
import { EventCreatureHeal } from './schemas/events/EventCreatureHeal';
import { EventCreatureDeath } from './schemas/events/EventCreatureDeath';
import { EventCreatureCastSpell } from './schemas/events/EventCreatureCastSpell';
import { EventCreatureAction } from './schemas/events/EventCreatureAction';
import { EquipItemOutcome } from './schemas/enums/EquipItemOutcome';
import { EffectSubtype } from './schemas/enums/EffectSubtype';
import { ScriptManager } from './libs/script-manager';
import { ModuleManager } from './ModuleManager';
import { ExtendableEntity } from './libs/extend-resolver/ExtendResolver';
import { CombatManager } from './libs/combat/CombatManager';
import { IManager } from './interfaces/IManager';

export class Manager implements IManager {
    public readonly events = new EventEmitter();
    public readonly scripts = new ScriptManager();
    private _time: number = 0;
    private readonly _moduleManager = new ModuleManager();
    private readonly _combatManager = new CombatManager();
    private readonly _creatures = new Map<string, Creature>();
    private readonly _items = new Map<string, Item>();
    private readonly _actionBlueprints = new Map<string, ActionBlueprint>();
    private readonly _itemOwnership = new Map<string, Creature>();
    private readonly _creatureCleanup = new Map<string, () => void>();

    // ▗▖ ▄      ▗▖     ▄▖                                              ▗▖
    // ▐█▟█▗▛▜▖ ▄▟▌▐▌▐▌ ▐▌ ▗▛▜▖    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌▘█▐▌▐▌▐▌▐▌▐▌▐▌ ▐▌ ▐▛▀▘    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘ ▀ ▀▀  ▀▀▘ ▀▀▘ ▀▀  ▀▀     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Module management

    defineAsset(resref: string, asset: ExtendableEntity) {
        this._moduleManager.addAsset(resref, asset);
    }

    //  ▄▄              ▗▖                                                      ▗▖
    // ▐▌▝▘▐▛▜▖▗▛▜▖ ▀▜▖▝▜▛▘▐▌▐▌▐▛▜▖▗▛▜▖    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌▗▖▐▌  ▐▛▀▘▗▛▜▌ ▐▌ ▐▌▐▌▐▌  ▐▛▀▘    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    //  ▀▀ ▝▘   ▀▀  ▀▀▘  ▀▘ ▀▀▘▝▘   ▀▀     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Creature management

    createCreature(resref: string, id: string = ''): Creature {
        const creatureBlueprint = this._moduleManager.getCreatureBlueprint(resref);
        if (!creatureBlueprint) {
            throw new ReferenceError(`Creature blueprint ${resref} not found`);
        }
        const creature = new Creature(id === '' ? undefined : id);
        const {
            ref,
            abilities,
            armorClass,
            specie,
            properties,
            equipment,
            actions,
            size,
            proficiencies,
        } = creatureBlueprint;
        creature.ref = ref ?? '';
        creature.state.armorClass = armorClass;
        creature.state.specie = specie;
        creature.state.abilities = abilities;
        creature.state.size = size;
        creature.state.proficiencies.push(...proficiencies);
        creature.state.properties.push(
            ...properties.map((p: PropertyDefinition) => PropertyBuilder.buildProperty(p))
        );
        this._creatures.set(creature.id, creature);
        creature.manager = this;
        this.plugCreatureEvents(creature);
        equipment
            .map((itemBlueprint: ItemBlueprint | string): Item => this.createItem(itemBlueprint))
            .forEach((item: Item) => creature.equipItem(item));
        actions
            .map(
                (actionBlueprint: ActionBlueprint | string): ActionState =>
                    this.createActionState(actionBlueprint)
            )
            .forEach((a) => {
                creature.state.actions[a.id] = a;
            });
        return creature;
    }

    destroyCreature(creature: Creature) {
        for (const item of Object.values(creature.state.equipment)) {
            if (item) {
                creature.unequipItem(item, true);
                this.destroyItem(item);
            }
        }
        const cleanupFunction = this._creatureCleanup.get(creature.id);
        if (cleanupFunction) {
            cleanupFunction();
            this._creatureCleanup.delete(creature.id);
        }
        this._creatures.delete(creature.id);
        creature.manager = null;
    }

    getCreature(id: string): Creature {
        const oCreature = this._creatures.get(id);
        if (oCreature) {
            return oCreature;
        } else {
            throw new ReferenceError(`creature ${id} not found`);
        }
    }

    addCreatureInnateProperty(creature: Creature, property: PropertyDefinition): Property {
        const built = PropertyBuilder.buildProperty(property);
        creature.state.properties.push(built);
        return built;
    }

    removeCreatureInnateProperty(creature: Creature, property: Property): void {
        const propertyId = property.id;
        const propFound: Property | undefined = creature.getters.getInnateProperties.find(
            (p) => p.id === propertyId
        );
        if (propFound) {
            creature.removeInnateProperty(propFound);
        }
    }

    getCreatureInnateProperties(creature: Creature): Property[] {
        return deepClone(creature.getters.getInnateProperties);
    }

    // ▗▄▄▖ ▗▖                                                  ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Item management

    createItem(rb: ItemBlueprint | string, id: string = ''): Item {
        if (typeof rb === 'string') {
            return this.createItemFromResref(rb, id);
        }
        return this.createItemFromBlueprint(rb, id);
    }

    getItemOwner(item: Item): Creature | undefined {
        return this._itemOwnership.get(item.id);
    }

    equipItem(creature: Creature, item: Item): EquipItemOutcome {
        const oItem = this._normalizeItem(item);
        const eqo = creature.equipItem(oItem);
        return eqo.outcome;
    }

    unequipItem(creature: Creature, item: Item): EquipItemOutcome {
        const oItem = this._normalizeItem(item);
        return creature.unequipItem(oItem);
    }

    addItemProperty(item: Item, property: PropertyDefinition): void {
        const oItem = this._normalizeItem(item);
        const built = PropertyBuilder.buildProperty(property);
        oItem.properties.push(built);
        const oOwner = this.getItemOwner(oItem);
        if (oOwner) {
            const equippedItem = Object.values(oOwner.state.equipment).find(
                (i) => i?.id === oItem.id
            );
            if (equippedItem) {
                equippedItem.properties.push(built);
            }
        }
    }

    removeItemProperty(item: Item, property: Property): void {
        const propertyId = property.id;
        const oItem = this._normalizeItem(item);
        oItem.properties = oItem.properties.filter((p) => p.id !== propertyId);
        const oOwner = this.getItemOwner(oItem);
        if (oOwner) {
            const equippedItem = Object.values(oOwner.state.equipment).find(
                (i) => i?.id === oItem.id
            );
            if (equippedItem) {
                const propFoundIndex = equippedItem.properties.findIndex(
                    (p) => p.id !== propertyId
                );
                if (propFoundIndex >= 0) {
                    equippedItem.properties.splice(propFoundIndex, 1);
                }
            }
        }
    }

    getItemProperties(item: Item): Property[] {
        return deepClone(this._normalizeItem(item).properties);
    }

    destroyItem(item: Item): void {
        const oItem = this._normalizeItem(item);
        const oOwner = this.getItemOwner(oItem);
        if (oOwner) {
            oOwner.unequipItem(oItem, true);
        }
        this._itemOwnership.delete(oItem.id);
        this._items.delete(oItem.id);
    }

    getItem(id: string): Item {
        const oItem = this._items.get(id);
        if (oItem) {
            return oItem;
        } else {
            throw new ReferenceError(`item ${id} not found`);
        }
    }

    // ▗▄▄▖  ▄▖  ▄▖         ▗▖                                          ▗▖
    // ▐▙▄  ▟▙▖ ▟▙▖▗▛▜▖▗▛▀ ▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘▐▌   ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘ ▝▘  ▝▘  ▀▀  ▀▀   ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Effect management

    getCreatureEffects(creature: Creature): Effect[] {
        return deepClone(creature.getters.getEffects);
    }

    applyEffect(
        creature: Creature,
        effect: EffectDefinition,
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        return creature.applyEffect(effect, source, duration, subtype, tag);
    }

    removeCreatureEffect(creature: Creature, effect: Effect): void {
        creature.removeEffect(effect);
    }

    //  ▗▖      ▗▖  ▗▖                                                  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Action management

    defineAction(actionBlueprint: ActionBlueprint) {
        this._actionBlueprints.set(actionBlueprint.id, actionBlueprint);
    }

    doAction(creature: Creature, actionId: string, target: Creature | undefined): void {
        const combat = this._combatManager.getCombat(creature);
        if (combat) {
            const action = creature.state.actions[actionId];
            combat.enqueueAction(actionId, target, action?.bonus ?? false);
        } else {
            creature.doAction(actionId, target);
        }
    }

    //  ▄▄         ▗▖       ▗▖                                          ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Combat Management

    startCombat(attacker: Creature, target: Creature): void {
        this._combatManager.createCombat(attacker, target);
    }

    /**
     * a creature stop all combats in which it is involved in
     * @param creature
     * @param bDisengage if true, the creature is disengaging the combat with skill, and do not suffer attack of opportunity
     */
    stopCombat(creature: Creature, bDisengage: boolean = false): void {
        const combat = this._combatManager.getCombat(creature);
        if (combat) {
            this._combatManager.disposeCombat(combat, !bDisengage);
        }
    }

    isFighting(creature: Creature, target?: Creature): boolean {
        const combat = this._combatManager.getCombat(creature);
        if (!combat) {
            return false;
        }
        return !target || combat.target === target;
    }

    getCombatTarget(creature: Creature): Creature | undefined {
        return this._combatManager.getCombat(creature)?.target;
    }

    getCombatAggressors(creature: Creature): Creature[] {
        return this._combatManager.getAllInvolvedCombats(creature).map((c) => c.attacker);
    }

    invokeThinker(scriptId: string, creature: Creature, target?: Creature): void {
        if (this.scripts.hasScript(scriptId)) {
            this.scripts.runScript(scriptId, creature, target);
        }
    }

    //  ▄▄              ▗▖      ▄▖       ▄▖             ▗▖  ▗▖
    // ▝▙▄ ▐▛▜▖▗▛▜▖▗▛▀  ▄▖  ▀▜▖ ▐▌      ▟▙▖▐▌▐▌▐▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖▗▛▀▘
    //   ▐▌▐▙▟▘▐▛▀▘▐▌   ▐▌ ▗▛▜▌ ▐▌      ▐▌ ▐▌▐▌▐▌▐▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌ ▀▜▖
    //  ▀▀ ▐▌   ▀▀  ▀▀  ▀▀  ▀▀▘ ▀▀      ▝▘  ▀▀▘▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘▝▀▀

    process(): void {
        ++this._time;
        for (const creature of this._creatures.values()) {
            creature.process();
        }
        this._combatManager.process();
    }

    // ▗▄▄      ▗▖          ▗▖                  ▗▖ ▗▖        ▗▖
    // ▐▌▐▌▐▛▜▖ ▄▖ ▐▌▐▌ ▀▜▖▝▜▛▘▗▛▜▖    ▐▙▟▙▗▛▜▖▝▜▛▘▐▙▄ ▗▛▜▖ ▄▟▌▗▛▀▘
    // ▐▛▀ ▐▌   ▐▌ ▝▙▟▘▗▛▜▌ ▐▌ ▐▛▀▘    ▐▛▛█▐▛▀▘ ▐▌ ▐▌▐▌▐▌▐▌▐▌▐▌ ▀▜▖
    // ▝▘  ▝▘   ▀▀  ▝▘  ▀▀▘  ▀▘ ▀▀     ▝▘ ▀ ▀▀   ▀▘▝▘▝▘ ▀▀  ▀▀▘▝▀▀
    // Private methods

    private _normalizeItem(item: Item): Item {
        return this.getItem(item.id);
    }

    private plugCreatureEvents(creature: Creature) {
        const ce = creature.events;
        this._creatureCleanup.set(creature.id, () => ce.removeAllListeners());
        ce.on(
            CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
            (p: EventEffectProcessorCreatureEffect) => this._onEffectApplied(p)
        );
        ce.on(
            CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED,
            (p: EventEffectProcessorCreatureEffect) => this._onEffectDisposed(p)
        );
        ce.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, (p: EventEffectProcessorImmunity) =>
            this._onEffectImmunity(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM, (p: EventCreatureEquipItem) =>
            this._onEquipItem(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM, (p: EventCreatureRemoveItem) =>
            this._onRemoveItem(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, (p: EventCreatureEquipItemFailed) =>
            this._onEquipItemFailed(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, (p: EventCreatureRemoveItemFailed) =>
            this._onRemoveItemFailed(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, (p: EventCreatureCheckSkill) =>
            this._onSkillCheck(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, (p: EventCreatureCheckResistance) =>
            this._onResistanceCheck(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_DAMAGED, (p: EventCreatureDamaged) =>
            this._onCreatureDamaged(p)
        );
        ce.on(CONSTS.EVENT_CREATURE_HEAL, (p: EventCreatureHeal) => this._onCreatureHeal(p));
        ce.on(CONSTS.EVENT_CREATURE_DEATH, (p: EventCreatureDeath) => this._onCreatureDeath(p));
        ce.on(CONSTS.EVENT_CREATURE_ACTION, (p: EventCreatureAction) => this._onCreatureAction(p));
        ce.on(CONSTS.EVENT_CREATURE_CAST_SPELL, (p: EventCreatureCastSpell) =>
            this._onCastSpell(p)
        ); // not fired
    }

    // ▗▄▄▖             ▗▖     ▗▖            ▗▖ ▄▖
    // ▐▙▄ ▐▌▐▌▗▛▜▖▐▛▜▖▝▜▛▘    ▐▙▄  ▀▜▖▐▛▜▖ ▄▟▌ ▐▌ ▗▛▜▖▐▛▜▖▗▛▀▘
    // ▐▌  ▝▙▟▘▐▛▀▘▐▌▐▌ ▐▌     ▐▌▐▌▗▛▜▌▐▌▐▌▐▌▐▌ ▐▌ ▐▛▀▘▐▌   ▀▜▖
    // ▝▀▀▘ ▝▘  ▀▀ ▝▘▝▘  ▀▘    ▝▘▝▘ ▀▀▘▝▘▝▘ ▀▀▘ ▀▀  ▀▀ ▝▘  ▝▀▀

    // ─── effect events ────────────────────────────────────────────────────────

    private _onEffectApplied(payload: EventEffectProcessorCreatureEffect): void {
        this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, payload);
    }

    private _onEffectDisposed(payload: EventEffectProcessorCreatureEffect): void {
        this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, payload);
    }

    private _onEffectImmunity(payload: EventEffectProcessorImmunity): void {
        this.events.emit(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, payload);
    }

    // ─── equipment events ─────────────────────────────────────────────────────

    private _onEquipItem(payload: EventCreatureEquipItem): void {
        this._itemOwnership.set(payload.item.id, payload.creature);
        this.events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM, payload);
    }

    private _onRemoveItem(payload: EventCreatureRemoveItem): void {
        this._itemOwnership.delete(payload.item.id);
        this.events.emit(CONSTS.EVENT_CREATURE_REMOVE_ITEM, payload);
    }

    private _onEquipItemFailed(payload: EventCreatureEquipItemFailed): void {
        this.events.emit(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, payload);
    }

    private _onRemoveItemFailed(payload: EventCreatureRemoveItemFailed): void {
        this.events.emit(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, payload);
    }

    // ─── check events ─────────────────────────────────────────────────────────

    private _onSkillCheck(payload: EventCreatureCheckSkill): void {
        this.events.emit(CONSTS.EVENT_CREATURE_SKILL_CHECK, payload);
    }

    private _onResistanceCheck(payload: EventCreatureCheckResistance): void {
        this.events.emit(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, payload);
    }

    // ─── life events ──────────────────────────────────────────────────────────

    private _onCreatureDamaged(payload: EventCreatureDamaged): void {
        this.events.emit(CONSTS.EVENT_CREATURE_DAMAGED, payload);
    }

    private _onCreatureHeal(payload: EventCreatureHeal): void {
        this.events.emit(CONSTS.EVENT_CREATURE_HEAL, payload);
    }

    private _onCreatureDeath(payload: EventCreatureDeath): void {
        const creature = payload.creature;
        this.stopCombat(creature, true); // we'll consider that dying is a form of skilled disengagement
        this.events.emit(CONSTS.EVENT_CREATURE_DEATH, payload);
    }

    // ─── action/spell events ──────────────────────────────────────────────────

    private _onCastSpell(payload: EventCreatureCastSpell): void {
        this.events.emit(CONSTS.EVENT_CREATURE_CAST_SPELL, payload);
    }

    private _onCreatureAction(payload: EventCreatureAction): void {
        if (this.scripts.hasScript(payload.script)) {
            this.scripts.runScript(payload.script, payload.creature, payload.target);
        }
        this.events.emit(CONSTS.EVENT_CREATURE_ACTION, payload);
    }

    //  ▄▄              ▗▖          ▗▖ ▗▖   ▗▖
    // ▐▌▝▘▐▛▜▖▗▛▜▖ ▀▜▖▝▜▛▘▗▛▜▖    ▝▜▛▘▐▙▄  ▄▖ ▐▛▜▖▗▛▜▌▗▛▀▘
    // ▐▌▗▖▐▌  ▐▛▀▘▗▛▜▌ ▐▌ ▐▛▀▘     ▐▌ ▐▌▐▌ ▐▌ ▐▌▐▌▝▙▟▌ ▀▜▖
    //  ▀▀ ▝▘   ▀▀  ▀▀▘  ▀▘ ▀▀       ▀▘▝▘▝▘ ▀▀ ▝▘▝▘▗▄▟▘▝▀▀

    private createItemFromBlueprint(itemBlueprint: ItemBlueprint, id: string = ''): Item {
        const item = ItemBuilder.buildItem(itemBlueprint, id === '' ? undefined : id);
        if (this._items.has(item.id)) {
            throw new ReferenceError(`Item with id ${item.id} already exists`);
        }
        this._items.set(item.id, item);
        return item;
    }

    private createItemFromResref(resref: string, id: string = ''): Item {
        const blueprint: ItemBlueprint = this._moduleManager.getItemBlueprint(resref);
        if (!blueprint) {
            throw new ReferenceError(`Creature equipment item blueprint ${resref} not found`);
        }
        return this.createItemFromBlueprint(blueprint, id);
    }

    private createActionStateFromBlueprint(actionBlueprint: ActionBlueprint): ActionState {
        return ActionStateSchema.parse({
            id: actionBlueprint.id,
            hostile: actionBlueprint.hostile,
            script: actionBlueprint.script,
            range: actionBlueprint.range,
            bonus: actionBlueprint.bonus,
            cooldown: CooldownManager.create({
                duration: actionBlueprint.cooldown,
                charges: actionBlueprint.charges,
            }),
        });
    }

    private createActionStateFromResref(resref: string): ActionState {
        const blueprint: ActionBlueprint | undefined = this._actionBlueprints.get(resref);
        if (!blueprint) {
            throw new ReferenceError(`Action blueprint ${resref} not found`);
        }
        return this.createActionStateFromBlueprint(blueprint);
    }

    private createActionState(rb: ActionBlueprint | string): ActionState {
        if (typeof rb === 'string') {
            return this.createActionStateFromResref(rb);
        }
        return this.createActionStateFromBlueprint(rb);
    }
}
