import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { RulesEngine } from '../../src/RulesEngine';
import { CREATURE_RESREF, makeRulesEngine } from '../RulesEngine/helpers';

describe('RulesEngine — combat lifecycle', () => {
    let rules: RulesEngine;
    let alice: Creature;
    let bob: Creature;
    let charlie: Creature;

    beforeEach(() => {
        rules = makeRulesEngine();
        alice = rules.createCreature(CREATURE_RESREF);
        bob = rules.createCreature(CREATURE_RESREF);
        charlie = rules.createCreature(CREATURE_RESREF);
    });

    describe('startCombat', () => {
        it('makes both creatures fight each other', () => {
            rules.startCombat(alice, bob);
            expect(rules.isFighting(alice)).toBe(true);
            expect(rules.isFighting(bob)).toBe(true);
        });

        it('alice targets bob, bob targets alice', () => {
            rules.startCombat(alice, bob);
            expect(rules.getCombatTarget(alice)).toBe(bob);
            expect(rules.getCombatTarget(bob)).toBe(alice);
        });

        it('does not redirect a target already in combat', () => {
            rules.startCombat(bob, charlie);
            rules.startCombat(alice, bob);
            expect(rules.getCombatTarget(bob)).toBe(charlie);
        });
    });

    describe('isFighting', () => {
        beforeEach(() => rules.startCombat(alice, bob));

        it('returns true when creature is in combat', () => {
            expect(rules.isFighting(alice)).toBe(true);
        });

        it('returns false when creature is not in combat', () => {
            expect(rules.isFighting(charlie)).toBe(false);
        });

        it('returns true when fighting the specified target', () => {
            expect(rules.isFighting(alice, bob)).toBe(true);
        });

        it('returns false when not fighting the specified target', () => {
            expect(rules.isFighting(alice, charlie)).toBe(false);
        });
    });

    describe('getCombatTarget', () => {
        it('returns the current target', () => {
            rules.startCombat(alice, bob);
            expect(rules.getCombatTarget(alice)).toBe(bob);
        });

        it('returns undefined when not in combat', () => {
            expect(rules.getCombatTarget(alice)).toBeUndefined();
        });
    });

    describe('getCombatAggressors', () => {
        it('returns all creatures attacking the given creature', () => {
            rules.startCombat(alice, bob); // alice→bob, bob→alice
            rules.startCombat(charlie, bob); // charlie→bob, bob already fighting
            const aggressors = rules.getCombatAggressors(bob);
            expect(aggressors).toContain(alice);
            expect(aggressors).toContain(charlie);
        });

        it('returns empty array when nobody is attacking', () => {
            expect(rules.getCombatAggressors(charlie)).toHaveLength(0);
        });
    });

    describe('stopCombat', () => {
        it('disengaging removes both combats', () => {
            rules.startCombat(alice, bob);
            rules.stopCombat(alice, true);
            expect(rules.isFighting(alice)).toBe(false);
            expect(rules.isFighting(bob)).toBe(false);
        });

        it('stopping without disengaging also removes both combats', () => {
            rules.startCombat(alice, bob);
            rules.stopCombat(alice);
            expect(rules.isFighting(alice)).toBe(false);
            expect(rules.isFighting(bob)).toBe(false);
        });

        it('stopping a creature not in combat does not throw', () => {
            expect(() => rules.stopCombat(charlie)).not.toThrow();
        });
    });
});
