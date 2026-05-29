import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { makeWeapon, makeAmmo } from '../helpers/helpers';
import {
    getEquippedWeaponList,
    getEquippedRangedWeaponList,
    getEquippedMeleeWeaponList,
    getEquippedNaturalWeaponList,
    selectBestWeaponForDistance,
} from '../../src/libs/combat/weapon-selector';

function makeMeleeWeapon(id = 'melee-1') {
    return makeWeapon({ id, equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] });
}

function makeReachWeapon(id = 'reach-1') {
    return makeWeapon({
        id,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
        attributes: [CONSTS.WEAPON_ATTRIBUTE_REACH],
    });
}

function makeRangedWeapon(id = 'ranged-1') {
    return makeWeapon({
        id,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
        attributes: [CONSTS.WEAPON_ATTRIBUTE_RANGED, CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
        ammoType: CONSTS.AMMO_TYPE_ARROW,
    });
}

function makeNaturalWeapon(slot = CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, id = 'natural-1') {
    return makeWeapon({ id, equipmentSlots: [slot] });
}

describe('weapon-selector', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    // ─── getEquippedWeaponList ────────────────────────────────────────────────

    describe('getEquippedWeaponList', () => {
        it('returns empty list when no weapons are equipped', () => {
            expect(getEquippedWeaponList(creature)).toHaveLength(0);
        });

        it('returns melee weapon with range 5, isRanged=false, isNatural=false', () => {
            const sword = makeMeleeWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = sword;
            const list = getEquippedWeaponList(creature);
            expect(list).toHaveLength(1);
            expect(list[0]).toMatchObject({
                slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
                item: sword,
                range: 5,
                isRanged: false,
                isNatural: false,
            });
        });

        it('returns ranged weapon with range 100 and isRanged=true', () => {
            const bow = makeRangedWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = bow;
            const list = getEquippedWeaponList(creature);
            expect(list).toHaveLength(1);
            expect(list[0]).toMatchObject({
                slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
                range: 100,
                isRanged: true,
                isNatural: false,
            });
        });

        it('returns reach weapon with range 10', () => {
            const halberd = makeReachWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = halberd;
            const list = getEquippedWeaponList(creature);
            expect(list[0].range).toBe(10);
        });

        it('returns natural weapon with isNatural=true', () => {
            const claw = makeNaturalWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = claw;
            const list = getEquippedWeaponList(creature);
            expect(list).toHaveLength(1);
            expect(list[0]).toMatchObject({
                slot: CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
                isNatural: true,
                isRanged: false,
            });
        });

        it('lists all three natural weapon slots when all are filled', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = makeNaturalWeapon(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, 'n1');
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2] = makeNaturalWeapon(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2, 'n2');
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3] = makeNaturalWeapon(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3, 'n3');
            expect(getEquippedWeaponList(creature)).toHaveLength(3);
        });
    });

    // ─── filter helpers ───────────────────────────────────────────────────────

    describe('getEquippedRangedWeaponList', () => {
        it('returns only ranged weapons', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeRangedWeapon();
            const list = getEquippedRangedWeaponList(creature);
            expect(list).toHaveLength(1);
            expect(list[0].isRanged).toBe(true);
        });

        it('returns empty when no ranged weapon is equipped', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            expect(getEquippedRangedWeaponList(creature)).toHaveLength(0);
        });
    });

    describe('getEquippedMeleeWeaponList', () => {
        it('returns only melee (non-ranged, non-natural) weapons', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeRangedWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = makeNaturalWeapon();
            const list = getEquippedMeleeWeaponList(creature);
            expect(list).toHaveLength(1);
            expect(list[0].slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });
    });

    describe('getEquippedNaturalWeaponList', () => {
        it('returns only natural weapons', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = makeNaturalWeapon(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, 'n1');
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2] = makeNaturalWeapon(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2, 'n2');
            const list = getEquippedNaturalWeaponList(creature);
            expect(list).toHaveLength(2);
            expect(list.every((w) => w.isNatural)).toBe(true);
        });
    });

    // ─── selectBestWeaponForDistance ─────────────────────────────────────────

    describe('selectBestWeaponForDistance', () => {
        it('returns null when no weapons are equipped', () => {
            expect(selectBestWeaponForDistance(creature, 5)).toBeNull();
        });

        it('returns null when equipped weapon cannot reach the target', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            expect(selectBestWeaponForDistance(creature, 15)).toBeNull();
        });

        it('selects melee slot at melee range (distance=5)', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            const slot = selectBestWeaponForDistance(creature, 5);
            expect(slot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
            expect(creature.state.selectedOffensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('prefers melee over natural at distance=5', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeMeleeWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = makeNaturalWeapon();
            expect(selectBestWeaponForDistance(creature, 5)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('falls back to natural when only natural weapon can reach at distance=5', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1] = makeNaturalWeapon();
            expect(selectBestWeaponForDistance(creature, 5)).toBe(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1);
        });

        it('selects reach weapon for distance=10 when melee (range 5) cannot reach', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeReachWeapon();
            expect(selectBestWeaponForDistance(creature, 10)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('returns null for unloaded ranged weapon at long distance', () => {
            // Bow without ammo → isRangedWeaponLoaded=false → filtered out
            const bow = makeRangedWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = bow;
            // no ammo equipped
            expect(selectBestWeaponForDistance(creature, 20)).toBeNull();
        });

        it('selects ranged slot when ranged is loaded and distance > 5', () => {
            const bow = makeRangedWeapon();
            const arrow = makeAmmo(CONSTS.AMMO_TYPE_ARROW);
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = bow;
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = arrow;
            expect(selectBestWeaponForDistance(creature, 20)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED);
        });

        it('prefers ranged over melee when distance > 5 and ranged is loaded', () => {
            const bow = makeRangedWeapon();
            const arrow = makeAmmo(CONSTS.AMMO_TYPE_ARROW);
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeReachWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = bow;
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = arrow;
            expect(selectBestWeaponForDistance(creature, 8)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED);
        });

        it('falls back to reach melee when ranged is not loaded at distance=8', () => {
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE] = makeReachWeapon();
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = makeRangedWeapon();
            // no ammo → ranged not loaded
            expect(selectBestWeaponForDistance(creature, 8)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('sets selectedOffensiveSlot on the creature state', () => {
            const bow = makeRangedWeapon();
            const arrow = makeAmmo(CONSTS.AMMO_TYPE_ARROW);
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] = bow;
            creature.state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO] = arrow;
            selectBestWeaponForDistance(creature, 30);
            expect(creature.state.selectedOffensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED);
        });

        it('does not mutate selectedOffensiveSlot when no weapon can reach (returns null)', () => {
            creature.state.selectedOffensiveSlot = CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE;
            const result = selectBestWeaponForDistance(creature, 50);
            expect(result).toBeNull();
            // selectedOffensiveSlot should not have been changed
            expect(creature.state.selectedOffensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });
    });
});
