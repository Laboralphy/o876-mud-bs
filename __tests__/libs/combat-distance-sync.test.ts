import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CombatManager } from '../../src/libs/combat/CombatManager';
import { Combat } from '../../src/libs/combat/Combat';
import { DISTANCE } from '../../src/libs/distance';
import { CREATURE_RESREF, makeManager } from '../Manager/helpers';

describe('CombatManager — combat distance synchronization', () => {
    let alice: Creature;
    let bob: Creature;
    let combatManager: CombatManager;
    let c1: Combat; // alice → bob
    let c2: Combat; // bob → alice

    beforeEach(() => {
        const manager = makeManager();
        alice = manager.createCreature(CREATURE_RESREF);
        bob = manager.createCreature(CREATURE_RESREF);
        combatManager = new CombatManager();
        c1 = combatManager.createCombat(alice, bob, true);
        c2 = combatManager.getCombat(bob)!;
    });

    it('createCombat(bBoth=true) registers both combat instances', () => {
        expect(c1).toBeDefined();
        expect(c2).toBeDefined();
        expect(c1.attacker).toBe(alice);
        expect(c2.attacker).toBe(bob);
    });

    it('both combats start at FAR distance', () => {
        expect(c1.getDistance()).toBe(DISTANCE.FAR);
        expect(c2.getDistance()).toBe(DISTANCE.FAR);
    });

    it('changing C1 distance syncs to C2', () => {
        c1.setDistance(DISTANCE.MEDIUM);
        expect(c2.getDistance()).toBe(DISTANCE.MEDIUM);
    });

    it('changing C2 distance syncs to C1', () => {
        c2.setDistance(DISTANCE.CLOSE);
        expect(c1.getDistance()).toBe(DISTANCE.CLOSE);
    });

    it('sync does not cause infinite loop (C2 change does not re-trigger C1 event)', () => {
        const distances: DISTANCE[] = [];
        c1.events.on('distance-changed', (d: { distance: DISTANCE }) => distances.push(d.distance));
        c1.setDistance(DISTANCE.MEDIUM);
        // C1 emits once; C2 is updated quietly — C2's update must NOT re-emit back to C1
        expect(distances).toHaveLength(1);
        expect(distances[0]).toBe(DISTANCE.MEDIUM);
    });

    it('approach() on C1 moves both combats one step closer', () => {
        c1.approach(); // FAR → MEDIUM
        expect(c1.getDistance()).toBe(DISTANCE.MEDIUM);
        expect(c2.getDistance()).toBe(DISTANCE.MEDIUM);
    });

    it('retreat() on C2 moves both combats one step farther', () => {
        c1.setDistance(DISTANCE.CLOSE);
        c2.retreat(); // CLOSE → MEDIUM
        expect(c2.getDistance()).toBe(DISTANCE.MEDIUM);
        expect(c1.getDistance()).toBe(DISTANCE.MEDIUM);
    });
});
