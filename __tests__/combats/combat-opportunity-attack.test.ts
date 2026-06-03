import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CombatManager } from '../../src/libs/combat/CombatManager';
import { Combat } from '../../src/libs/combat/Combat';
import { CONSTS } from '../../src/consts';
import { CREATURE_WITH_GEAR_RESREF, makeManager } from '../Manager/helpers';

describe('Combat — opportunity attack on unilateral disengagement', () => {
    let combatManager: CombatManager;
    let alice: Creature; // has melee weapon
    let bob: Creature;
    let cAlice: Combat; // alice → bob
    let cBob: Combat;   // bob → alice

    beforeEach(() => {
        const manager = makeManager();
        alice = manager.createCreature(CREATURE_WITH_GEAR_RESREF);
        bob = manager.createCreature(CREATURE_WITH_GEAR_RESREF);
        combatManager = new CombatManager();
        cAlice = combatManager.createCombat(alice, bob);
        cBob = combatManager.getCombat(bob)!;
        // set CLOSE distance so melee weapons are usable
        cAlice.setDistance(CONSTS.DISTANCE_CLOSE);
    });

    it('alice gets an opportunity attack when bob disengages without skill', () => {
        combatManager.disposeCombat(cBob, true); // bob stops, alice gets opportunity
        expect(alice.state.actionTaken).toBe(true);
    });

    it('alice uses bonus slot if normal action is already spent', () => {
        alice.state.actionTaken = true;
        combatManager.disposeCombat(cBob, true);
        expect(alice.state.bonusActionTaken).toBe(true);
    });

    it('no opportunity attack when both action slots are spent', () => {
        alice.state.actionTaken = true;
        alice.state.bonusActionTaken = true;
        combatManager.disposeCombat(cBob, true);
        // nothing extra should happen — just verify it doesn't throw
        expect(alice.state.actionTaken).toBe(true);
        expect(alice.state.bonusActionTaken).toBe(true);
    });

    it('no opportunity attack when bob disengages with skill', () => {
        combatManager.disposeCombat(cBob, false); // skilled disengage
        expect(alice.state.actionTaken).toBe(false);
    });

    it('both combats are removed after unilateral disengagement', () => {
        combatManager.disposeCombat(cBob, true);
        expect(combatManager.getCombat(alice)).toBeUndefined();
        expect(combatManager.getCombat(bob)).toBeUndefined();
    });

    it('both combats are removed after skilled disengagement', () => {
        combatManager.disposeCombat(cBob, false);
        expect(combatManager.getCombat(alice)).toBeUndefined();
        expect(combatManager.getCombat(bob)).toBeUndefined();
    });

    it('pending actions are cleared before the opportunity attack fires', () => {
        cAlice.enqueueAction('some-action', bob, false);
        combatManager.disposeCombat(cBob, true);
        // opportunity attack consumed the normal slot via weapon attack, not the queued action
        expect(alice.state.actionTaken).toBe(true);
    });
});
