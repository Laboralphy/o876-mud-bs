import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../../../src/Creature';
import { RulesEngine } from '../../../../src/RulesEngine';
import { CONSTS } from '../../../../src/consts';
import { getAreaOfEffectCreatures } from '../../../../src/modules/classic/scripts/helpers';
import { CREATURE_RESREF, makeRulesEngine } from '../../../RulesEngine/helpers';
import { Distance } from '../../../../src/schemas/enums/Distance';

// startCombat always creates a mutual combat (mirror is auto-created).
// Setting distance on the attacker side syncs to the mirror via the distance-changed event.

function setCombatDistance(rules: RulesEngine, attacker: Creature, distance: Distance) {
    rules['_combatManager'].getCombat(attacker)!.setDistance(distance);
}

describe('getAreaOfEffectCreatures', () => {
    let rules: RulesEngine;
    let alice: Creature; // subject
    let bob: Creature; // target
    let carol: Creature; // extra aggressor

    beforeEach(() => {
        rules = makeRulesEngine();
        alice = rules.createCreature(CREATURE_RESREF);
        bob = rules.createCreature(CREATURE_RESREF);
        carol = rules.createCreature(CREATURE_RESREF);
    });

    it('returns [target] when subject is not in combat', () => {
        const result = getAreaOfEffectCreatures(rules, alice, bob);
        expect(result).toEqual([bob]);
    });

    it('returns [target] when only subject and target fight each other at the same distance', () => {
        rules.startCombat(alice, bob); // auto-creates bob→alice mirror
        setCombatDistance(rules, alice, CONSTS.DISTANCE_CLOSE); // syncs bob→alice to CLOSE
        const result = getAreaOfEffectCreatures(rules, alice, bob);
        expect(result).toEqual([bob]);
    });

    it('includes all aggressors at the same distance as the target', () => {
        rules.startCombat(alice, bob); // alice↔bob at default distance
        rules.startCombat(carol, alice); // carol→alice; alice stays focused on bob
        setCombatDistance(rules, alice, CONSTS.DISTANCE_CLOSE); // alice→bob + bob→alice synced to CLOSE
        setCombatDistance(rules, carol, CONSTS.DISTANCE_CLOSE); // carol→alice at CLOSE
        const result = getAreaOfEffectCreatures(rules, alice, bob);
        expect(result).toContain(bob);
        expect(result).toContain(carol);
        expect(result).toHaveLength(2);
    });

    it('excludes aggressors at a different distance than the target', () => {
        rules.startCombat(alice, bob);
        rules.startCombat(carol, alice);
        setCombatDistance(rules, carol, CONSTS.DISTANCE_FAR); // carol→alice at FAR (also propagates to alice→bob)
        setCombatDistance(rules, alice, CONSTS.DISTANCE_CLOSE); // alice→bob + bob→alice at CLOSE (wins)
        const result = getAreaOfEffectCreatures(rules, alice, bob);
        expect(result).toContain(bob);
        expect(result).not.toContain(carol);
        expect(result).toHaveLength(1);
    });
});
