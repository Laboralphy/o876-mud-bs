import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CombatManager } from '../../src/libs/combat/CombatManager';
import { CREATURE_RESREF, makeManager } from '../Manager/helpers';

describe('CombatManager — retaliation on engagement', () => {
    let combatManager: CombatManager;
    let alice: Creature;
    let bob: Creature;
    let charlie: Creature;

    beforeEach(() => {
        const manager = makeManager();
        alice = manager.createCreature(CREATURE_RESREF);
        bob = manager.createCreature(CREATURE_RESREF);
        charlie = manager.createCreature(CREATURE_RESREF);
        combatManager = new CombatManager();
    });

    it('engaging an idle target creates both combats', () => {
        combatManager.createCombat(alice, bob);
        expect(combatManager.getCombat(alice)).toBeDefined();
        expect(combatManager.getCombat(bob)).toBeDefined();
    });

    it('alice targets bob and bob retaliates against alice', () => {
        combatManager.createCombat(alice, bob);
        expect(combatManager.getCombat(alice)!.target).toBe(bob);
        expect(combatManager.getCombat(bob)!.target).toBe(alice);
    });

    it('engaging a target already in combat does not redirect their attack', () => {
        combatManager.createCombat(bob, charlie);
        combatManager.createCombat(alice, bob);
        expect(combatManager.getCombat(bob)!.target).toBe(charlie);
    });

    it('engaging a target already in combat still creates the attacker combat', () => {
        combatManager.createCombat(bob, charlie);
        combatManager.createCombat(alice, bob);
        expect(combatManager.getCombat(alice)!.target).toBe(bob);
    });

    it('does not cause a stack overflow', () => {
        expect(() => combatManager.createCombat(alice, bob)).not.toThrow();
    });

    it('registers exactly two combats for a fresh mutual engagement', () => {
        combatManager.createCombat(alice, bob);
        expect(combatManager.combats.size).toBe(2);
    });
});
