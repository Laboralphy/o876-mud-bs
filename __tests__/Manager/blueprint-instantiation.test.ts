import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Manager } from '../../src/Manager';
import { CONSTS } from '../../src/consts';

// Load modules once at module level so resref lists are ready for it.each
const _setup = new Manager();
_setup.loadModules();

const creatureRefs = _setup.moduleManager
    .getResRefList()
    .filter(
        (ref) =>
            _setup.moduleManager.getAsset(ref, (e) => e).entityType === CONSTS.ENTITY_TYPE_CREATURE
    );

const itemRefs = _setup.moduleManager
    .getResRefList()
    .filter(
        (ref) => _setup.moduleManager.getAsset(ref, (e) => e).entityType === CONSTS.ENTITY_TYPE_ITEM
    );

describe('blueprint instantiation – creatures', () => {
    let manager: Manager;

    beforeEach(() => {
        manager = new Manager();
        manager.loadModules();
    });

    afterEach(() => {
        // nothing to clean up; Manager is local to each test
    });

    it('has at least one creature blueprint', () => {
        expect(creatureRefs.length).toBeGreaterThan(0);
    });

    it.each(creatureRefs)('createCreature("%s") does not throw', (ref) => {
        expect(() => {
            const creature = manager.createCreature(ref);
            manager.destroyCreature(creature);
        }).not.toThrow();
    });
});

describe('blueprint instantiation – items', () => {
    let manager: Manager;

    beforeEach(() => {
        manager = new Manager();
        manager.loadModules();
    });

    it('has at least one item blueprint', () => {
        expect(itemRefs.length).toBeGreaterThan(0);
    });

    it.each(itemRefs)('createItem("%s") does not throw', (ref) => {
        // TODO Test is crashing (and other tests too) because ammo-arrow-fire is dependent to something
        // not processed yet

        expect(() => {
            manager.createItem(ref);
        }).not.toThrow();
    });
});
