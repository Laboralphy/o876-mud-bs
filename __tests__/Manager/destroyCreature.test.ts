import { beforeEach, describe, expect, it } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { Item } from '../../src/schemas/Item';
import { makeCursedPropertyDefinition } from '../helpers/helpers';
import { CREATURE_RESREF, CREATURE_WITH_GEAR_RESREF, makeManager } from './helpers';

describe('Manager.destroyCreature', () => {
    let manager: Manager;
    let creature: Creature;
    let equippedItems: Item[];

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_WITH_GEAR_RESREF);
        equippedItems = Object.values(creature.state.equipment).filter((item): item is Item => item !== null);
    });

    it('creature has equipment before destruction', () => {
        expect(equippedItems.length).toBeGreaterThan(0);
    });

    it('all equipped items are registered in item ownership before destruction', () => {
        for (const item of equippedItems) {
            expect(manager.getItemOwner(item.id)).toBe(creature);
        }
    });

    it('all item ownership entries are cleared after destruction', () => {
        manager.destroyCreature(creature);
        for (const item of equippedItems) {
            expect(manager.getItemOwner(item.id)).toBeUndefined();
        }
    });

    it('creature is removed from the registry after destruction', () => {
        const id = creature.id;
        manager.destroyCreature(creature);
        expect(manager.getCreature(id)).toBeUndefined();
    });

    it('all equipment slots are empty on the creature state after destruction', () => {
        manager.destroyCreature(creature);
        const remaining = Object.values(creature.state.equipment).filter((item) => item !== null);
        expect(remaining).toHaveLength(0);
    });

    it('destroying a creature with no equipment succeeds without error', () => {
        const bare = manager.createCreature(CREATURE_RESREF);
        expect(() => manager.destroyCreature(bare)).not.toThrow();
    });

    it('bypasses cursed items — cursed gear is removed on destruction', () => {
        const cursedWeapon = manager.createItem({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_SLASHING,
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            attributes: [],
            size: CONSTS.WEAPON_SIZE_MEDIUM,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
            properties: [makeCursedPropertyDefinition()],
            weight: 1,
        });
        creature.equipItem(cursedWeapon);
        // unequipItem without bypass would fail — destroy must bypass
        manager.destroyCreature(creature);
        expect(manager.getItemOwner(cursedWeapon.id)).toBeUndefined();
    });
});
