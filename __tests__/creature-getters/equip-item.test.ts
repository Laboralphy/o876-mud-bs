import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { makeWeapon } from '../helpers/helpers';

describe('equipment', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('hero');
    });

    describe('findEquippedItemSlot', () => {
        it('returns undefined when item is not equipped', () => {
            const sword = makeWeapon({ id: 'sword' });
            expect(creature.findEquippedItemSlot(sword)).toBeUndefined();
        });

        it('returns the slot the item occupies', () => {
            const sword = makeWeapon({ id: 'sword' });
            creature.equipItem(sword);
            expect(creature.findEquippedItemSlot(sword)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });
    });

    describe('unequipItem', () => {
        it('returns success and clears the slot', () => {
            const sword = makeWeapon({ id: 'sword' });
            creature.equipItem(sword);
            expect(creature.unequipItem(sword)).toBe(CONSTS.EQUIP_ITEM_SUCCESS);
            expect(creature.findEquippedItemSlot(sword)).toBeUndefined();
        });

        it('emits EVENT_CREATURE_REMOVE_ITEM on success', () => {
            const sword = makeWeapon({ id: 'sword' });
            creature.equipItem(sword);
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM, listener);
            creature.unequipItem(sword);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ item: sword, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
            );
        });

        it('returns NOT_EQUIPPED when item is not in any slot', () => {
            const sword = makeWeapon({ id: 'sword' });
            expect(creature.unequipItem(sword)).toBe(CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED);
        });

        it('emits EVENT_CREATURE_REMOVE_ITEM_FAILED when item is not equipped', () => {
            const sword = makeWeapon({ id: 'sword' });
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, listener);
            creature.unequipItem(sword);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NOT_EQUIPPED })
            );
        });

        it('returns CURSED_SLOT and keeps the item equipped when item is cursed', () => {
            const cursed = makeWeapon({ id: 'cursed', properties: [{ type: CONSTS.PROPERTY_CURSED }] });
            creature.equipItem(cursed);
            expect(creature.unequipItem(cursed)).toBe(CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT);
            expect(creature.findEquippedItemSlot(cursed)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('emits EVENT_CREATURE_REMOVE_ITEM_FAILED when item is cursed', () => {
            const cursed = makeWeapon({ id: 'cursed', properties: [{ type: CONSTS.PROPERTY_CURSED }] });
            creature.equipItem(cursed);
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, listener);
            creature.unequipItem(cursed);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT })
            );
        });
    });

    describe('equipItem', () => {
        it('equips into an empty slot and returns success', () => {
            const sword = makeWeapon({ id: 'sword' });
            const result = creature.equipItem(sword);
            expect(result.outcome).toBe(CONSTS.EQUIP_ITEM_SUCCESS);
            expect(result.equippedItem).toEqual(sword);
            expect(result.unequippedItem).toBeNull();
            expect(creature.findEquippedItemSlot(sword)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('emits EVENT_CREATURE_EQUIP_ITEM on success', () => {
            const sword = makeWeapon({ id: 'sword' });
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM, listener);
            creature.equipItem(sword);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ item: sword, slot: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE })
            );
        });

        it('returns NO_SUITABLE_SLOT for an item with no equipment slots', () => {
            const unequippable = makeWeapon({ id: 'unequippable', equipmentSlots: [] });
            const result = creature.equipItem(unequippable);
            expect(result.outcome).toBe(CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT);
            expect(result.equippedItem).toBeNull();
            expect(result.unequippedItem).toBeNull();
        });

        it('emits EVENT_CREATURE_EQUIP_ITEM_FAILED when item has no suitable slot', () => {
            const unequippable = makeWeapon({ id: 'unequippable', equipmentSlots: [] });
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, listener);
            creature.equipItem(unequippable);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_NO_SUITABLE_SLOT })
            );
        });

        it('displaces the previous item when the slot is occupied', () => {
            const oldSword = makeWeapon({ id: 'old' });
            const newSword = makeWeapon({ id: 'new' });
            creature.equipItem(oldSword);
            const result = creature.equipItem(newSword);
            expect(result.outcome).toBe(CONSTS.EQUIP_ITEM_SUCCESS);
            expect(result.equippedItem).toEqual(newSword);
            expect(result.unequippedItem).toEqual(oldSword);
            expect(creature.findEquippedItemSlot(newSword)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
            expect(creature.findEquippedItemSlot(oldSword)).toBeUndefined();
        });

        it('returns CURSED_SLOT and emits failed event when the occupied slot holds a cursed item', () => {
            const cursed = makeWeapon({ id: 'cursed', properties: [{ type: CONSTS.PROPERTY_CURSED }] });
            const newSword = makeWeapon({ id: 'new' });
            creature.equipItem(cursed);
            const listener = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, listener);
            const result = creature.equipItem(newSword);
            expect(result.outcome).toBe(CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT);
            expect(result.equippedItem).toBeNull();
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ reason: CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT })
            );
        });

        it('uses the first available slot when item supports multiple slots', () => {
            const dual = makeWeapon({
                id: 'dual',
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE, CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            });
            creature.equipItem(dual);
            expect(creature.findEquippedItemSlot(dual)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
        });

        it('falls back to the second slot when the first is occupied', () => {
            const meleeOnly = makeWeapon({ id: 'melee' });
            const dual = makeWeapon({
                id: 'dual',
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE, CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            });
            creature.equipItem(meleeOnly);
            const result = creature.equipItem(dual);
            expect(result.outcome).toBe(CONSTS.EQUIP_ITEM_SUCCESS);
            expect(result.unequippedItem).toBeNull();
            expect(creature.findEquippedItemSlot(dual)).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED);
        });
    });
});
