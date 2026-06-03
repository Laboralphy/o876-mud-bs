import { Manager } from '../../src/Manager';
import { CONSTS } from '../../src/consts';
import { Item } from '../../src/schemas/Item';
import { ItemBuilder } from '../../src/builders/ItemBuilder';
import { WeaponBlueprintSchema } from '../../src/schemas/WeaponBlueprint';
import { ShieldBlueprintSchema } from '../../src/schemas/ShieldBlueprint';
import { GearBlueprintSchema } from '../../src/schemas/GearBlueprint';

export const CREATURE_RESREF = 'test-creature';
export const CREATURE_WITH_GEAR_RESREF = 'test-creature-with-gear';

const WEAPON_BLUEPRINT = WeaponBlueprintSchema.parse({
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d8',
    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
    proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
    attributes: [],
    size: CONSTS.WEAPON_SIZE_MEDIUM,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
    properties: [],
    weight: 1,
});

const SHIELD_BLUEPRINT = ShieldBlueprintSchema.parse({
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_SHIELD,
    armorClass: 2,
    proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
    properties: [],
    weight: 2,
});

const BASE_ABILITIES = {
    [CONSTS.ABILITY_BODY]: 10,
    [CONSTS.ABILITY_MIND]: 10,
    [CONSTS.ABILITY_SENSES]: 10,
    [CONSTS.ABILITY_PRESENCE]: 10,
};

export function makeManager(): Manager {
    const manager = new Manager();
    manager.defineAsset(CREATURE_RESREF, {
        entityType: CONSTS.ENTITY_TYPE_CREATURE,
        abilities: BASE_ABILITIES,
        armorClass: 10,
        specie: CONSTS.SPECIE_HUMANOID,
        size: CONSTS.CREATURE_SIZE_MEDIUM,
        proficiencies: [],
        properties: [],
        equipment: [],
        actions: [],
    });
    manager.defineAsset(CREATURE_WITH_GEAR_RESREF, {
        entityType: CONSTS.ENTITY_TYPE_CREATURE,
        abilities: BASE_ABILITIES,
        armorClass: 10,
        specie: CONSTS.SPECIE_HUMANOID,
        size: CONSTS.CREATURE_SIZE_MEDIUM,
        proficiencies: [],
        properties: [],
        proficiencies: [],
        equipment: [WEAPON_BLUEPRINT, SHIELD_BLUEPRINT],
        actions: [],
    });
    return manager;
}

export function makeWeapon(id?: string): Item {
    return ItemBuilder.buildItem(
        WeaponBlueprintSchema.parse({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            damages: '1d8',
            damageType: CONSTS.DAMAGE_TYPE_SLASHING,
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            attributes: [],
            size: CONSTS.WEAPON_SIZE_MEDIUM,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            properties: [],
            weight: 1,
        }),
        id
    );
}

export function makeSlotlessGear(): Item {
    return ItemBuilder.buildItem(
        GearBlueprintSchema.parse({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_RING,
            equipmentSlots: [],
            properties: [],
            weight: 0,
        })
    );
}
