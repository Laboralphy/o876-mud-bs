import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RulesEngine } from '../../src/RulesEngine';
import { CONSTS } from '../../src/consts';

// Load modules once at module level so resref lists are ready for it.each
const _setup = new RulesEngine();
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
    let rules: RulesEngine;

    beforeEach(() => {
        rules = new RulesEngine();
        rules.loadModules();
    });

    afterEach(() => {
        // nothing to clean up; RulesEngine is local to each test
    });

    it('has at least one creature blueprint', () => {
        expect(creatureRefs.length).toBeGreaterThan(0);
    });

    it.each(creatureRefs)('createCreature("%s") does not throw', (ref) => {
        expect(() => {
            const creature = rules.createCreature(ref);
            rules.destroyCreature(creature);
        }).not.toThrow();
    });
});

describe('blueprint instantiation – items', () => {
    let rules: RulesEngine;

    beforeEach(() => {
        rules = new RulesEngine();
        rules.loadModules();
    });

    it('has at least one item blueprint', () => {
        expect(itemRefs.length).toBeGreaterThan(0);
    });

    it.each(itemRefs)('createItem("%s") does not throw', (ref) => {
        // TODO Test is crashing (and other tests too) because ammo-arrow-fire is dependent to something
        // not processed yet

        expect(() => {
            rules.createItem(ref);
        }).not.toThrow();
    });
});
