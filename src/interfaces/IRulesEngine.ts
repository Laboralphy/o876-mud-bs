import { Creature } from '../Creature';
import { Property, PropertyDefinition } from '../properties/schemas';
import { ItemBlueprint } from '../schemas/ItemBlueprint';
import { Item } from '../schemas/Item';
import { EquipItemOutcome } from '../schemas/enums/EquipItemOutcome';
import { Effect, EffectDefinition } from '../effects/schemas';
import { EffectSubtype } from '../schemas/enums/EffectSubtype';
import { Distance } from '../schemas/enums/Distance';

export interface IRulesEngine {
    //  ▄▄              ▗▖                                                      ▗▖
    // ▐▌▝▘▐▛▜▖▗▛▜▖ ▀▜▖▝▜▛▘▐▌▐▌▐▛▜▖▗▛▜▖    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌▗▖▐▌  ▐▛▀▘▗▛▜▌ ▐▌ ▐▌▐▌▐▌  ▐▛▀▘    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    //  ▀▀ ▝▘   ▀▀  ▀▀▘  ▀▘ ▀▀▘▝▘   ▀▀     ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Creature management

    createCreature(resref: string, id?: string): Creature;
    destroyCreature(creature: Creature): void;
    getCreature(id: string): Creature;
    addCreatureInnateProperty(creature: Creature, property: PropertyDefinition): Property;
    removeCreatureInnateProperty(creature: Creature, property: Property): void;
    getCreatureInnateProperties(creature: Creature): Property[];

    // ▗▄▄▖ ▗▖                                                  ▗▖
    //  ▐▌ ▝▜▛▘▗▛▜▖▐▙▟▙    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    //  ▐▌  ▐▌ ▐▛▀▘▐▛▛█    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘  ▀▘ ▀▀ ▝▘ ▀    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Item management

    createItem(rb: ItemBlueprint | string, id?: string): Item;
    getItemOwner(item: Item): Creature | undefined;
    equipItem(creature: Creature, item: Item): EquipItemOutcome;
    unequipItem(creature: Creature, item: Item): EquipItemOutcome;
    addItemProperty(item: Item, property: PropertyDefinition): void;
    removeItemProperty(item: Item, property: Property): void;
    getItemProperties(item: Item): Property[];
    destroyItem(item: Item): void;

    // ▗▄▄▖  ▄▖  ▄▖         ▗▖                                          ▗▖
    // ▐▙▄  ▟▙▖ ▟▙▖▗▛▜▖▗▛▀ ▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌   ▐▌  ▐▌ ▐▛▀▘▐▌   ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▀▀▘ ▝▘  ▝▘  ▀▀  ▀▀   ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Effect management

    getCreatureEffects(creature: Creature): Effect[];
    applyEffect(
        creature: Creature,
        effect: EffectDefinition,
        source: Creature,
        duration: number,
        subtype?: EffectSubtype,
        tag?: string
    ): Effect;
    removeCreatureEffect(creature: Creature, effect: Effect): void;

    //  ▗▖      ▗▖  ▗▖                                                  ▗▖
    // ▗▛▜▖▗▛▀ ▝▜▛▘ ▄▖ ▗▛▜▖▐▛▜▖    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▙▟▌▐▌   ▐▌  ▐▌ ▐▌▐▌▐▌▐▌    ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    // ▝▘▝▘ ▀▀   ▀▘ ▀▀  ▀▀ ▝▘▝▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Action management

    doAction(creature: Creature, actionId: string, target: Creature | undefined): void;

    //  ▄▄         ▗▖       ▗▖                                          ▗▖
    // ▐▌▝▘▗▛▜▖▐▙▟▙▐▙▄  ▀▜▖▝▜▛▘    ▐▙▟▙ ▀▜▖▐▛▜▖ ▀▜▖▗▛▜▌▗▛▜▖▐▙▟▙▗▛▜▖▐▛▜▖▝▜▛▘
    // ▐▌▗▖▐▌▐▌▐▛▛█▐▌▐▌▗▛▜▌ ▐▌     ▐▛▛█▗▛▜▌▐▌▐▌▗▛▜▌▝▙▟▌▐▛▀▘▐▛▛█▐▛▀▘▐▌▐▌ ▐▌
    //  ▀▀  ▀▀ ▝▘ ▀▝▀▀  ▀▀▘  ▀▘    ▝▘ ▀ ▀▀▘▝▘▝▘ ▀▀▘▗▄▟▘ ▀▀ ▝▘ ▀ ▀▀ ▝▘▝▘  ▀▘
    // Combat Management

    startCombat(attacker: Creature, target: Creature): void;
    stopCombat(creature: Creature, bDisengage?: boolean): void;
    isFighting(creature: Creature, target?: Creature): boolean;
    getCombatTarget(creature: Creature): Creature | undefined;
    getDistanceToCombatTarget(creature: Creature): Distance | undefined;
    getCombatAggressors(creature: Creature, distance?: Distance): Creature[];
    invokeThinker(scriptId: string, creature: Creature, target?: Creature): void;
}
