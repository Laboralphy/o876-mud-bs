import { beforeEach, describe, expect, it } from 'vitest';
import { CONSTS } from '../../src/consts';
import { RulesEngine } from '../../src/RulesEngine';
import { Creature } from '../../src/Creature';
import { Item } from '../../src/schemas/Item';
import { makeRulesEngine, CREATURE_RESREF } from './helpers';

describe('cursed item', () => {
    let rules: RulesEngine;
    let bob: Creature;
    let cursedSword: Item;

    beforeEach(() => {
        rules = makeRulesEngine();
        bob = rules.createCreature(CREATURE_RESREF);
        cursedSword = rules.createItem({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_SLASHING,
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            attributes: [],
            size: CONSTS.WEAPON_SIZE_MEDIUM,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            properties: [{ type: CONSTS.PROPERTY_CURSED }],
            weight: 1,
        });
        bob.equipItem(cursedSword);
    });

    it('cursed sword is registered in item ownership after equip', () => {
        expect(rules.getItemOwner(cursedSword)).toBe(bob);
    });

    it('unequipping without bypass returns a failure reason', () => {
        const outcome = bob.unequipItem(cursedSword);
        expect(outcome).toBe(CONSTS.EQUIP_ITEM_FAILURE_REASON_CURSED_SLOT);
    });

    it('cursed sword remains equipped after failed unequip attempt', () => {
        bob.unequipItem(cursedSword);
        const equipped = Object.values(bob.state.equipment).filter((item) => item !== null);
        expect(equipped).toHaveLength(1);
    });

    it('cursed sword remains registered in item ownership after failed unequip', () => {
        bob.unequipItem(cursedSword);
        expect(rules.getItemOwner(cursedSword)).toBe(bob);
    });
});
