import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { Combat } from '../../src/libs/combat/Combat';
import { CombatManager } from '../../src/libs/combat/CombatManager';
import { CooldownManager } from '../../src/libs/cooldown';
import { ActionStateSchema } from '../../src/schemas/Action';
import { CONSTS } from '../../src/consts';
import { CREATURE_RESREF, makeRulesEngine } from '../RulesEngine/helpers';

function addAction(creature: Creature, id: string, charges = 2, bonus = false) {
    creature.state.actions[id] = ActionStateSchema.parse({
        id,
        hostile: true,
        script: `scripts/${id}`,
        range: CONSTS.DISTANCE_CLOSE,
        cooldown: CooldownManager.create({ duration: 10, charges }),
        bonus,
    });
}

describe('Combat — pending action slot', () => {
    let combatManager: CombatManager;
    let alice: Creature;
    let bob: Creature;
    let combat: Combat; // alice → bob

    beforeEach(() => {
        const rules = makeRulesEngine();
        alice = rules.createCreature(CREATURE_RESREF);
        bob = rules.createCreature(CREATURE_RESREF);
        combatManager = new CombatManager();
        combat = combatManager.createCombat(alice, bob);
        combat.setDistance(CONSTS.DISTANCE_CLOSE);
        addAction(alice, 'strike');
        addAction(alice, 'quickstep', 2, true);
    });

    describe('enqueueing', () => {
        it('second enqueue replaces the first pending normal action', () => {
            const fn1 = vi.fn();
            const fn2 = vi.fn();
            alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
                if (p.actionId === 'strike') {
                    fn1();
                }
            });
            addAction(alice, 'zap');
            alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
                if (p.actionId === 'zap') {
                    fn2();
                }
            });
            combat.enqueueAction('strike', bob, false);
            combat.enqueueAction('zap', bob, false); // replaces 'strike'
            combat.playRound();
            expect(fn1).not.toHaveBeenCalled();
            expect(fn2).toHaveBeenCalledOnce();
        });

        it('normal and bonus queues are independent', () => {
            combat.enqueueAction('strike', bob, false);
            combat.enqueueAction('quickstep', bob, true);
            combat.playRound();
            combat.playBonusRound();
            expect(alice.state.actionTaken).toBe(true);
            expect(alice.state.bonusActionTaken).toBe(true);
        });
    });

    describe('playRound consumes pending normal action', () => {
        it('executes the pending action before AI fallback', () => {
            const fn = vi.fn();
            alice.events.on(CONSTS.EVENT_CREATURE_ACTION, fn);
            combat.enqueueAction('strike', bob, false);
            combat.playRound();
            expect(fn).toHaveBeenCalledOnce();
            expect(fn.mock.calls[0][0].actionId).toBe('strike');
        });

        it('pending slot is cleared after being consumed', () => {
            // non-hostile action: AI will never auto-select it, so only fires if pending
            alice.state.actions['heal'] = ActionStateSchema.parse({
                id: 'heal',
                hostile: false,
                script: 'scripts/heal',
                range: CONSTS.DISTANCE_CLOSE,
                cooldown: CooldownManager.create({ duration: 10, charges: 2 }),
                bonus: false,
            });
            combat.enqueueAction('heal', undefined, false);
            combat.playRound();
            alice.state.actionTaken = false;
            const fn = vi.fn();
            alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
                if (p.actionId === 'heal') {
                    fn();
                }
            });
            combat.playRound();
            expect(fn).not.toHaveBeenCalled();
        });
    });

    describe('playBonusRound consumes pending bonus action', () => {
        it('executes the pending bonus action', () => {
            const fn = vi.fn();
            alice.events.on(CONSTS.EVENT_CREATURE_ACTION, fn);
            combat.enqueueAction('quickstep', bob, true);
            combat.playBonusRound();
            expect(fn).toHaveBeenCalledOnce();
            expect(fn.mock.calls[0][0].actionId).toBe('quickstep');
        });
    });

    describe('failed pending action', () => {
        it('emits EVENT_COMBAT_ACTION_FAILURE when action is unavailable', () => {
            const fn = vi.fn();
            combat.events.on(CONSTS.EVENT_COMBAT_ACTION_FAILURE, fn);
            combat.enqueueAction('nonexistent-action', bob, false);
            combat.playRound();
            expect(fn).toHaveBeenCalledOnce();
            expect(fn.mock.calls[0][0].actionId).toBe('nonexistent-action');
            expect(fn.mock.calls[0][0].bonus).toBe(false);
        });

        it('emits EVENT_COMBAT_ACTION_FAILURE when action is not ready', () => {
            // exhaust all charges
            addAction(alice, 'limited', 1);
            alice.doAction('limited', bob);
            const fn = vi.fn();
            combat.events.on(CONSTS.EVENT_COMBAT_ACTION_FAILURE, fn);
            combat.enqueueAction('limited', bob, false);
            alice.state.actionTaken = false; // reset so playRound runs
            combat.playRound();
            expect(fn).toHaveBeenCalledOnce();
            expect(fn.mock.calls[0][0].reason).toBe('ACTION_FAILED_NOT_READY');
        });
    });
});
