import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import {
    makeWeapon,
    makeRegenProperty,
    makeAbilityModifierProperty,
    makeArmorClassModifierProperty,
} from '../helpers/helpers';

describe('getInnateProperties', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when creature has no properties', () => {
        expect(creature.getters.getInnateProperties).toEqual([]);
    });

    it('returns the innate properties', () => {
        const prop = makeAbilityModifierProperty(2);
        creature.state.properties.push(prop);
        expect(creature.getters.getInnateProperties).toHaveLength(1);
    });

    it('returns a copy — mutating the result does not affect state', () => {
        creature.state.properties.push(makeAbilityModifierProperty(2));
        const result = creature.getters.getInnateProperties;
        result.pop();
        expect(creature.state.properties).toHaveLength(1);
    });

    it('returns all innate properties', () => {
        creature.state.properties.push(makeAbilityModifierProperty(2));
        creature.state.properties.push(makeRegenProperty());
        expect(creature.getters.getInnateProperties).toHaveLength(2);
    });
});

describe('getActiveProperties', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when there are no properties', () => {
        expect(creature.getters.getActiveProperties).toEqual([]);
    });

    it('returns properties that have a registered program', () => {
        creature.state.properties.push(makeRegenProperty());
        expect(creature.getters.getActiveProperties).toHaveLength(1);
    });

    it('filters out properties with no registered program', () => {
        // PROPERTY_ABILITY_MODIFIER has no registered program
        creature.state.properties.push(makeAbilityModifierProperty(2));
        expect(creature.getters.getActiveProperties).toHaveLength(0);
    });

    it('includes equipment properties that have a registered program', () => {
        const weapon = makeWeapon({
            properties: [makeRegenProperty().data],
        });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = weapon;
        expect(creature.getters.getActiveProperties).toHaveLength(1);
    });

    it('combines innate and equipment active properties', () => {
        creature.state.properties.push(makeRegenProperty());
        const weapon = makeWeapon({ properties: [makeRegenProperty().data] });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = weapon;
        expect(creature.getters.getActiveProperties).toHaveLength(2);
    });
});

describe('getEquipmentSlotProperties', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty object when no items are equipped', () => {
        expect(creature.getters.getEquipmentSlotProperties).toEqual({});
    });

    it('returns properties from weapon in offensive slot', () => {
        const prop = makeAbilityModifierProperty(2);
        const weapon = makeWeapon({ properties: [prop.data] });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = weapon;
        const slotProps = creature.getters.getEquipmentSlotProperties;
        expect(slotProps[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toHaveLength(1);
    });

    it('returns empty entry for slot with item but no properties', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon();
        const slotProps = creature.getters.getEquipmentSlotProperties;
        expect(slotProps[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeUndefined();
    });

});

describe('removeInnateProperty', () => {
    it('removes the matching property and leaves the rest intact', () => {
        const creature = new Creature('test');

        creature.addInnateProperty(makeAbilityModifierProperty(2).data);
        creature.addInnateProperty(makeAbilityModifierProperty(4).data);
        creature.addInnateProperty(makeArmorClassModifierProperty(3).data);

        // Grab the stored reference for the ability modifier we want to remove
        const toRemove = creature.state.properties.find(
            (p) => p.type === CONSTS.PROPERTY_ABILITY_MODIFIER
        )!;
        creature.removeInnateProperty(toRemove);

        expect(creature.state.properties).toHaveLength(2);
        expect(creature.state.properties.some((p) => p === toRemove)).toBe(false);
        expect(
            creature.state.properties.filter((p) => p.type === CONSTS.PROPERTY_ABILITY_MODIFIER)
        ).toHaveLength(1);
        expect(
            creature.state.properties.some((p) => p.type === CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER)
        ).toBe(true);
    });

    it('does nothing when the property is not in the list', () => {
        const creature = new Creature('test');
        creature.addInnateProperty(makeAbilityModifierProperty(2).data);

        const stranger = makeAbilityModifierProperty(2); // different object, not stored
        creature.removeInnateProperty(stranger);

        expect(creature.state.properties).toHaveLength(1);
    });
});

describe('getEquipmentProperties', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when no items are equipped', () => {
        expect(creature.getters.getEquipmentProperties).toEqual([]);
    });

    it('returns properties from a single equipped weapon', () => {
        const weapon = makeWeapon({ properties: [makeAbilityModifierProperty(2).data] });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = weapon;
        expect(creature.getters.getEquipmentProperties).toHaveLength(1);
    });

    it('flattens properties from multiple slots', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            properties: [makeAbilityModifierProperty(2).data],
        });
        // Put a regen property directly via innate to ensure slot properties are separate
        creature.state.properties.push(makeAbilityModifierProperty(1));
        // Equipment properties should not include innate ones
        expect(creature.getters.getEquipmentProperties).toHaveLength(1);
    });
});
