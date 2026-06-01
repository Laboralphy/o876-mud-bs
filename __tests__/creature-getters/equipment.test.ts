import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { makeWeapon, makeAmmo, makeShield } from '../helpers/helpers';

describe('isRangedWeaponLoaded', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns false when no ranged weapons is equipped', () => {
        expect(creature.getters.isRangedWeaponLoaded).toBe(false);
    });

    it('returns false when ranged weapons has no AMMUNITION attribute', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            attributes: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        expect(creature.getters.isRangedWeaponLoaded).toBe(false);
    });

    it('returns false when weapons requires ammo but none is equipped', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            ammoType: CONSTS.AMMO_TYPE_ARROW,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        expect(creature.getters.isRangedWeaponLoaded).toBe(false);
    });

    it('returns false when ammo type does not match weapons', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            ammoType: CONSTS.AMMO_TYPE_ARROW,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = makeAmmo(CONSTS.AMMO_TYPE_QUARREL);
        expect(creature.getters.isRangedWeaponLoaded).toBe(false);
    });

    it('returns true when weapons and ammo types match', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            ammoType: CONSTS.AMMO_TYPE_ARROW,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = makeAmmo(CONSTS.AMMO_TYPE_ARROW);
        expect(creature.getters.isRangedWeaponLoaded).toBe(true);
    });
});

describe('getSelectedWeaponAttributeSet', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty set when no weapons is equipped', () => {
        expect(creature.getters.getSelectedWeaponAttributeSet.size).toBe(0);
    });

    it('returns attributes of the selected weapons', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
        });
        const attrs = creature.getters.getSelectedWeaponAttributeSet;
        expect(attrs.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)).toBe(true);
    });

    it('returns empty set when selected slot has no item', () => {
        creature.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
        expect(creature.getters.getSelectedWeaponAttributeSet.size).toBe(0);
    });

    it('reflects the selected offensive slot', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        creature.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
        const attrs = creature.getters.getSelectedWeaponAttributeSet;
        expect(attrs.has(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)).toBe(true);
    });
});

describe('isWieldingShield', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns false when no shield is equipped', () => {
        expect(creature.getters.isWieldingShield).toBe(false);
    });

    it('returns true when shield is equipped and no two-handed weapons is selected', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] = makeShield();
        expect(creature.getters.isWieldingShield).toBe(true);
    });

    it('returns false when shield is equipped but a two-handed weapons is selected', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] = makeShield();
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
        });
        expect(creature.getters.isWieldingShield).toBe(false);
    });
});

describe('isWieldingTwoHandedWeapon', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns false when no weapons is equipped', () => {
        expect(creature.getters.isWieldingTwoHandedWeapon).toBe(false);
    });

    it('returns true when a two-handed weapons is selected', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
        });
        expect(creature.getters.isWieldingTwoHandedWeapon).toBe(true);
    });

    it('returns true for a versatile weapons when no shield is equipped', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_VERSATILE],
        });
        expect(creature.getters.isWieldingTwoHandedWeapon).toBe(true);
    });

    it('returns false for a versatile weapons when a shield is equipped', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_VERSATILE],
        });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] = makeShield();
        expect(creature.getters.isWieldingTwoHandedWeapon).toBe(false);
    });

    it('returns false for a normal weapons', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon();
        expect(creature.getters.isWieldingTwoHandedWeapon).toBe(false);
    });
});

describe('getDefensiveSlots', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when nothing is equipped', () => {
        expect(creature.getters.getDefensiveSlots).toEqual([]);
    });

    it('returns occupied defensive slots', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_HEAD] = makeWeapon({
            itemType: CONSTS.ITEM_TYPE_WEAPON,
        });
        expect(creature.getters.getDefensiveSlots).toContain(CONSTS.EQUIPMENT_SLOT_HEAD);
    });

    it('includes shield slot when not wielding a two-handed weapons', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] = makeShield();
        expect(creature.getters.getDefensiveSlots).toContain(CONSTS.EQUIPMENT_SLOT_SHIELD);
    });

    it('excludes shield slot when wielding a two-handed weapons', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] = makeShield();
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
        });
        expect(creature.getters.getDefensiveSlots).not.toContain(CONSTS.EQUIPMENT_SLOT_SHIELD);
    });

    it('does not include offensive slots', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon();
        expect(creature.getters.getDefensiveSlots).not.toContain(
            CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE
        );
    });
});

describe('getOffensiveSlots', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when selected slot has no item', () => {
        expect(creature.getters.getOffensiveSlots).toEqual([]);
    });

    it('returns selected melee slot when a weapons is equipped there', () => {
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeWeapon();
        expect(creature.getters.getOffensiveSlots).toEqual([CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]);
    });

    it('returns ranged slot without ammo slot when weapons is not loaded', () => {
        creature.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            ammoType: CONSTS.AMMO_TYPE_ARROW,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        expect(creature.getters.getOffensiveSlots).toEqual([CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]);
    });

    it('returns ranged and ammo slots when weapons is loaded', () => {
        creature.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED;
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeWeapon({
            attributes: [CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
            ammoType: CONSTS.AMMO_TYPE_ARROW,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        });
        creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = makeAmmo(CONSTS.AMMO_TYPE_ARROW);
        expect(creature.getters.getOffensiveSlots).toEqual([
            CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
            CONSTS.EQUIPMENT_SLOT_AMMO,
        ]);
    });
});
