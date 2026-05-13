import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { LocationRegistry } from '../../src/libs/locations/LocationRegistry';
import { CONSTS } from '../../src/consts';
import { Item } from '../../src/schemas/Item';
import { Environment } from '../../src/schemas/enums/Environment';

function makeRegistry(l2Environments: Environment[] = [CONSTS.ENVIRONMENT_DARKNESS]) {
    const registry = new LocationRegistry();
    registry.defineLocation('l1');
    registry.defineLocation('l2', l2Environments);
    return registry;
}

describe('torch lighting scenario', () => {
    let registry: LocationRegistry;
    let c1: Creature, c2: Creature, c3: Creature;

    beforeEach(() => {
        registry = makeRegistry();

        c1 = new Creature('c1');
        c2 = new Creature('c2');
        c3 = new Creature('c3');

        const t1: Item = {
            id: 'torch-1',
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_TORCH,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            properties: [{ type: CONSTS.PROPERTY_LIGHT }],
            temporaryProperties: [],
            weight: 0.5,
        } as Item;
        c1.equipItem(t1);

        registry.moveCreature(c1, 'l1');
        registry.moveCreature(c2, 'l1');
        registry.moveCreature(c3, 'l1');
    });

    it('all see each other in the lit room L1', () => {
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('C2 and C3 cannot see each other in the dark room L2', () => {
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');

        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
    });

    it('all see each other in L2 once C1 (torch bearer) joins', () => {
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');
        registry.moveCreature(c1, 'l2');

        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });
});

describe('darkvision helm scenario', () => {
    let registry: LocationRegistry;
    let c1: Creature, c2: Creature, c3: Creature;

    beforeEach(() => {
        registry = makeRegistry();

        c1 = new Creature('c1');
        c2 = new Creature('c2');
        c3 = new Creature('c3');

        const h1: Item = {
            id: 'helm-darkvision-1',
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_HELM,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_HEAD],
            properties: [{ type: CONSTS.PROPERTY_DARKVISION }],
            temporaryProperties: [],
            weight: 1,
        } as Item;
        c1.equipItem(h1);

        registry.moveCreature(c1, 'l1');
        registry.moveCreature(c2, 'l1');
        registry.moveCreature(c3, 'l1');
    });

    it('all see each other in the lit room L1', () => {
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('C2 and C3 cannot see each other in the dark room L2', () => {
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');

        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
    });

    it('only C1 (darkvision wearer) can see in L2 — C2 and C3 remain blind to each other and to C1', () => {
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');
        registry.moveCreature(c1, 'l2');

        // C1 can see everyone — darkvision
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);

        // C2 and C3 have no darkvision and no light source — darkness
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_DARKNESS);
    });
});

describe('fog scenario — darkvision and torch are both useless', () => {
    let registry: LocationRegistry;
    let c1: Creature, c2: Creature, c3: Creature;

    beforeEach(() => {
        registry = makeRegistry([CONSTS.ENVIRONMENT_FOG]);

        c1 = new Creature('c1');
        c2 = new Creature('c2');
        c3 = new Creature('c3');

        // C1 wears a helm of infravision (darkvision)
        const helmInfravision: Item = {
            id: 'helm-infravision-1',
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_HELM,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_HEAD],
            properties: [{ type: CONSTS.PROPERTY_DARKVISION }],
            temporaryProperties: [],
            weight: 1,
        } as Item;
        c1.equipItem(helmInfravision);

        // C2 holds a torch
        const torch: Item = {
            id: 'torch-1',
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_TORCH,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
            properties: [{ type: CONSTS.PROPERTY_LIGHT }],
            temporaryProperties: [],
            weight: 0.5,
        } as Item;
        c2.equipItem(torch);

        registry.moveCreature(c1, 'l1');
        registry.moveCreature(c2, 'l1');
        registry.moveCreature(c3, 'l1');
    });

    it('all see each other in the normal room L1', () => {
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_VISIBLE);
    });

    it('C2 and C3 are blinded in the fog room L2', () => {
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');

        // C2 holds a torch but fog still blinds the observer
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('fog blinds even in a naturally lit room — no ENVIRONMENT_DARKNESS needed', () => {
        // L2 is foggy but has no darkness environment — it would be bright without the fog
        expect(registry.getLocation('l2')?.environments.has(CONSTS.ENVIRONMENT_DARKNESS)).toBe(
            false
        );

        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');

        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });

    it('all are blinded in L2 — fog defeats both darkvision and torch', () => {
        registry.moveCreature(c1, 'l2');
        registry.moveCreature(c2, 'l2');
        registry.moveCreature(c3, 'l2');

        // C1 has darkvision — irrelevant, fog blinds first
        expect(c1.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        expect(c1.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);

        // C2 holds a torch — irrelevant, fog blinds the observer regardless of carried light
        expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        expect(c2.getCreatureVisibility(c3)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);

        // C3 has neither — blinded
        expect(c3.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
        expect(c3.getCreatureVisibility(c2)).toBe(CONSTS.CREATURE_VISIBILITY_BLINDED);
    });
});
