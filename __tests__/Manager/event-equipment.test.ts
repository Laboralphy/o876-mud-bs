import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { Item } from '../../src/schemas/Item';
import { CREATURE_RESREF, makeManager, makeSlotlessGear, makeWeapon } from './helpers';

describe('Manager — equipment events', () => {
    let manager: Manager;
    let creature: Creature;
    let weapon: Item;

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
        weapon = makeWeapon();
    });

    describe('EVENT_CREATURE_EQUIP_ITEM', () => {
        it('registers item ownership when a weapons is equipped', () => {
            creature.equipItem(weapon);
            expect(manager.getItemOwner(weapon)).toBe(creature);
        });

        it('ownership is set to the correct creature when two creatures each equip their own weapons', () => {
            const other = manager.createCreature(CREATURE_RESREF);
            const otherWeapon = makeWeapon('other-sword');
            creature.equipItem(weapon);
            other.equipItem(otherWeapon);
            expect(manager.getItemOwner(weapon)).toBe(creature);
            expect(manager.getItemOwner(otherWeapon)).toBe(other);
        });
    });

    describe('EVENT_CREATURE_REMOVE_ITEM', () => {
        it('clears item ownership when the weapons is unequipped', () => {
            creature.equipItem(weapon);
            creature.unequipItem(weapon);
            expect(manager.getItemOwner(weapon)).toBeUndefined();
        });

        it('does not affect ownership of a different item when only one is removed', () => {
            const sword = makeWeapon('sword');
            creature.equipItem(weapon);
            // equip sword after weapons has been auto-removed from the melee slot by the new equip
            creature.unequipItem(sword); // sword never equipped — ownership must not be set
            expect(manager.getItemOwner(weapon)).toBe(creature);
        });
    });

    describe('EVENT_CREATURE_EQUIP_ITEM_FAILED', () => {
        it('fires without error when equipping an item with no valid slot', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_EQUIP_ITEM_FAILED, spy);
            const slotless = makeSlotlessGear();
            creature.equipItem(slotless);
            expect(spy).toHaveBeenCalledOnce();
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                item: slotless,
            });
        });
    });

    describe('EVENT_CREATURE_REMOVE_ITEM_FAILED', () => {
        it('fires without error when unequipping an item that was never equipped', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, spy);
            creature.unequipItem(weapon); // weapons was never equipped
            expect(spy).toHaveBeenCalledOnce();
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                item: weapon,
            });
        });
    });
});
