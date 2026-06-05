import { beforeEach, describe, expect, it } from 'vitest';
import { CONSTS } from '../../src/consts';
import { RulesEngine } from '../../src/RulesEngine';
import { Creature } from '../../src/Creature';
import { Item } from '../../src/schemas/Item';
import { makeCursedPropertyDefinition } from '../helpers/helpers';
import { CREATURE_RESREF, CREATURE_WITH_GEAR_RESREF, makeRulesEngine } from './helpers';

describe('RulesEngine.destroyCreature', () => {
    let rules: RulesEngine;
    let creature: Creature;
    let equippedItems: Item[];

    beforeEach(() => {
        rules = makeRulesEngine();
        creature = rules.createCreature(CREATURE_WITH_GEAR_RESREF);
        equippedItems = Object.values(creature.state.equipment).filter(
            (item): item is Item => item !== null
        );
    });

    it('creature has equipment before destruction', () => {
        expect(equippedItems.length).toBeGreaterThan(0);
    });

    it('all equipped items are registered in item ownership before destruction', () => {
        for (const item of equippedItems) {
            expect(rules.getItemOwner(item)).toBe(creature);
        }
    });

    it('all item ownership entries are cleared after destruction', () => {
        rules.destroyCreature(creature);
        for (const item of equippedItems) {
            expect(rules.getItemOwner(item)).toBeUndefined();
        }
    });

    it('creature is removed from the registry after destruction', () => {
        const id = creature.id;
        rules.destroyCreature(creature);
        expect(() => rules.getCreature(id)).toThrow();
    });

    it('all equipment slots are empty on the creature state after destruction', () => {
        rules.destroyCreature(creature);
        const remaining = Object.values(creature.state.equipment).filter((item) => item !== null);
        expect(remaining).toHaveLength(0);
    });

    it('destroying a creature with no equipment succeeds without error', () => {
        const bare = rules.createCreature(CREATURE_RESREF);
        expect(() => rules.destroyCreature(bare)).not.toThrow();
    });

    it('bypasses cursed items — cursed gear is removed on destruction', () => {
        const cursedWeapon = rules.createItem({
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
        rules.destroyCreature(creature);
        expect(rules.getItemOwner(cursedWeapon)).toBeUndefined();
        expect(() => rules.getItem(cursedWeapon.id)).toThrow(
            new ReferenceError(`item ${cursedWeapon.id} not found`)
        );
    });
});
