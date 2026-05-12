import { CONSTS } from '../../src/consts';
import { Item } from '../../src/schemas/Item';
import { Effect } from '../../src/effects/schemas';
import { Property } from '../../src/properties/schemas';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export function makeWeapon(overrides: DeepPartial<Item> = {}): Item {
    return {
        id: 'weapon-1',
        entityType: CONSTS.ENTITY_TYPE_ITEM,
        itemType: CONSTS.ITEM_TYPE_WEAPON,
        damages: '1d8',
        damageType: CONSTS.DAMAGE_TYPE_SLASHING,
        proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
        attributes: [],
        size: CONSTS.WEAPON_SIZE_MEDIUM,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
        properties: [],
        temporaryProperties: [],
        weight: 1,
        ...overrides,
    } as Item;
}

export function makeAmmo(ammoType = CONSTS.AMMO_TYPE_ARROW): Item {
    return {
        id: 'ammo-1',
        entityType: CONSTS.ENTITY_TYPE_ITEM,
        itemType: CONSTS.ITEM_TYPE_AMMO,
        ammoType,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_AMMO],
        properties: [],
        temporaryProperties: [],
        weight: 0.1,
    } as Item;
}

export function makeShield(): Item {
    return {
        id: 'shield-1',
        entityType: CONSTS.ENTITY_TYPE_ITEM,
        itemType: CONSTS.ITEM_TYPE_SHIELD,
        armorClass: 2,
        proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
        properties: [],
        temporaryProperties: [],
        weight: 2,
    } as Item;
}

export function makeEffect(overrides: Partial<Effect> = {}): Effect {
    return {
        id: 'eff-1',
        type: CONSTS.EFFECT_ABILITY_MODIFIER,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        duration: 5,
        target: 'creature-1',
        source: 'creature-2',
        siblings: [],
        tag: 'test',
        amp: 2,
        ability: CONSTS.ABILITY_BODY,
        ...overrides,
    } as Effect;
}

export function makeRegenEffect(overrides: Partial<Effect> = {}): Effect {
    return {
        id: 'regen-1',
        type: CONSTS.EFFECT_REGENERATION,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        duration: 5,
        target: 'creature-1',
        source: 'creature-2',
        siblings: [],
        tag: 'regen',
        amp: 3,
        vulnerabilities: [],
        useConstitutionModifier: false,
        shutdown: 0,
        threshold: 1,
        ...overrides,
    } as Effect;
}

export function makeRegenProperty(overrides: Partial<Property> = {}): Property {
    return {
        type: CONSTS.PROPERTY_REGENERATION,
        amp: 2,
        vulnerabilities: [],
        useBodyModifier: false,
        shutdown: 0,
        threshold: 0,
        ...overrides,
    } as Property;
}

export function makeAbilityModifierProperty(amp = 2, ability = CONSTS.ABILITY_BODY): Property {
    return {
        type: CONSTS.PROPERTY_ABILITY_MODIFIER,
        amp,
        ability,
    } as Property;
}
