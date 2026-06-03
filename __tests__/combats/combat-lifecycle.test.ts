import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { Manager } from '../../src/Manager';
import { CREATURE_RESREF, makeManager } from '../Manager/helpers';

describe('Manager — combat lifecycle', () => {
    let manager: Manager;
    let alice: Creature;
    let bob: Creature;
    let charlie: Creature;

    beforeEach(() => {
        manager = makeManager();
        alice = manager.createCreature(CREATURE_RESREF);
        bob = manager.createCreature(CREATURE_RESREF);
        charlie = manager.createCreature(CREATURE_RESREF);
    });

    describe('startCombat', () => {
        it('makes both creatures fight each other', () => {
            manager.startCombat(alice, bob);
            expect(manager.isFighting(alice)).toBe(true);
            expect(manager.isFighting(bob)).toBe(true);
        });

        it('alice targets bob, bob targets alice', () => {
            manager.startCombat(alice, bob);
            expect(manager.getCombatTarget(alice)).toBe(bob);
            expect(manager.getCombatTarget(bob)).toBe(alice);
        });

        it('does not redirect a target already in combat', () => {
            manager.startCombat(bob, charlie);
            manager.startCombat(alice, bob);
            expect(manager.getCombatTarget(bob)).toBe(charlie);
        });
    });

    describe('isFighting', () => {
        beforeEach(() => manager.startCombat(alice, bob));

        it('returns true when creature is in combat', () => {
            expect(manager.isFighting(alice)).toBe(true);
        });

        it('returns false when creature is not in combat', () => {
            expect(manager.isFighting(charlie)).toBe(false);
        });

        it('returns true when fighting the specified target', () => {
            expect(manager.isFighting(alice, bob)).toBe(true);
        });

        it('returns false when not fighting the specified target', () => {
            expect(manager.isFighting(alice, charlie)).toBe(false);
        });
    });

    describe('getCombatTarget', () => {
        it('returns the current target', () => {
            manager.startCombat(alice, bob);
            expect(manager.getCombatTarget(alice)).toBe(bob);
        });

        it('returns undefined when not in combat', () => {
            expect(manager.getCombatTarget(alice)).toBeUndefined();
        });
    });

    describe('getCombatAggressors', () => {
        it('returns all creatures attacking the given creature', () => {
            manager.startCombat(alice, bob);   // alice→bob, bob→alice
            manager.startCombat(charlie, bob); // charlie→bob, bob already fighting
            const aggressors = manager.getCombatAggressors(bob);
            expect(aggressors).toContain(alice);
            expect(aggressors).toContain(charlie);
        });

        it('returns empty array when nobody is attacking', () => {
            expect(manager.getCombatAggressors(charlie)).toHaveLength(0);
        });
    });

    describe('stopCombat', () => {
        it('disengaging removes both combats', () => {
            manager.startCombat(alice, bob);
            manager.stopCombat(alice, true);
            expect(manager.isFighting(alice)).toBe(false);
            expect(manager.isFighting(bob)).toBe(false);
        });

        it('stopping without disengaging also removes both combats', () => {
            manager.startCombat(alice, bob);
            manager.stopCombat(alice);
            expect(manager.isFighting(alice)).toBe(false);
            expect(manager.isFighting(bob)).toBe(false);
        });

        it('stopping a creature not in combat does not throw', () => {
            expect(() => manager.stopCombat(charlie)).not.toThrow();
        });
    });
});
