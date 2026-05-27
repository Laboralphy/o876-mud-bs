import { CONSTS } from '../../src/consts';
import { Item } from '../../src/schemas/Item';
import { Effect } from '../../src/effects/schemas';
import { Property, PropertyDefinition } from '../../src/properties/schemas';
import { PropertyBuilder } from '../../src/builders/PropertyBuilder';
import { ItemBuilder } from '../../src/builders/ItemBuilder';
import { WeaponBlueprint, WeaponBlueprintSchema } from '../../src/schemas/WeaponBlueprint';
import { AmmoBlueprintSchema } from '../../src/schemas/AmmoBlueprint';
import { ShieldBlueprintSchema } from '../../src/schemas/ShieldBlueprint';
import { Ability } from '../../src/schemas/enums/Ability';

export function makeWeapon(overrides: Partial<WeaponBlueprint> & { id?: string } = {}): Item {
    const { id = 'weapon-1', ...blueprintOverrides } = overrides;
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
            ...blueprintOverrides,
        }),
        id
    );
}

export function makeAmmo(ammoType = CONSTS.AMMO_TYPE_ARROW): Item {
    return ItemBuilder.buildItem(
        AmmoBlueprintSchema.parse({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_AMMO,
            ammoType,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_AMMO],
            properties: [],
            weight: 0.1,
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
        }),
        'ammo-1'
    );
}

export function makeShield(): Item {
    return ItemBuilder.buildItem(
        ShieldBlueprintSchema.parse({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_SHIELD,
            armorClass: 2,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_SHIELD],
            properties: [],
            weight: 2,
        }),
        'shield-1'
    );
}

export function makeAbilityModifierEffect(overrides: Partial<Effect> = {}): Effect {
    return {
        id: 'eff-1',
        type: CONSTS.EFFECT_ABILITY_MODIFIER,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        duration: 5,
        target: 'creature-1',
        source: 'creature-2',
        siblings: [],
        tag: 'test',
        data: {
            amp: 2,
            ability: CONSTS.ABILITY_BODY,
        },
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
        data: {
            type: CONSTS.EFFECT_REGENERATION,
            amp: 3,
            vulnerabilities: [],
            useConstitutionModifier: false,
            shutdown: 0,
            threshold: 1,
        },
        ...overrides,
    } as Effect;
}

export function makeRegenProperty(amp: string = '2d1'): Property {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_REGENERATION,
        shutdown: 0,
        amp,
        threshold: 0,
        useBodyModifier: false,
        vulnerabilities: [],
    });
}

export function makeAbilityModifierProperty(
    amp = 2,
    ability: Ability = CONSTS.ABILITY_BODY
): Property {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_ABILITY_MODIFIER,
        amp,
        ability,
    });
}

export function makeArmorClassModifierProperty(amp = 1): Property {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        amp,
    });
}

export function makeAbilityResistanceModifierProperty(
    amp = 2,
    ability: Ability = CONSTS.ABILITY_BODY
): Property {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_ABILITY_RESISTANCE_MODIFIER,
        amp,
        ability,
    });
}

export function makeSkillModifierProperty(
    amp = 1,
    skill: Skill = CONSTS.SKILL_ATHLETICS
): Property {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_SKILL_MODIFIER,
        amp,
        skill,
    });
}

export function makeCursedPropertyDefinition(): PropertyDefinition {
    return { type: CONSTS.PROPERTY_CURSED };
}
