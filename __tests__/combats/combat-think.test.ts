import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { Manager } from '../../src/Manager';
import { IManager } from '../../src/interfaces/IManager';
import { ActionStateSchema } from '../../src/schemas/Action';
import { CooldownManager } from '../../src/libs/cooldown';
import { CONSTS } from '../../src/consts';
import { CREATURE_RESREF, makeManager } from '../Manager/helpers';

describe('Manager — think system', () => {
    let manager: Manager;
    let alice: Creature;
    let bob: Creature;

    beforeEach(() => {
        manager = makeManager();
        alice = manager.createCreature(CREATURE_RESREF);
        bob = manager.createCreature(CREATURE_RESREF);
    });

    it('creature.manager is set after createCreature', () => {
        expect(alice.manager).toBe(manager);
    });

    it('creature.manager is cleared after destroyCreature', () => {
        manager.destroyCreature(alice);
        expect(alice.manager).toBeNull();
    });

    it('PROPERTY_THINK is a valid property type', () => {
        expect(CONSTS.PROPERTY_THINK).toBe('PROPERTY_THINK');
    });

    it('think script is called during process() for creatures with PROPERTY_THINK', () => {
        const fn = vi.fn();
        manager.thinkers.declare('ai-basic', fn);
        manager.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, script: 'ai-basic' });
        manager.process();
        expect(fn).toHaveBeenCalledOnce();
    });

    it('think script receives manager and creature in context', () => {
        let capturedCtx: { manager: IManager; creature: Creature } | undefined;
        manager.thinkers.declare('ai-inspect', (ctx) => {
            capturedCtx = ctx;
        });
        manager.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, script: 'ai-inspect' });
        manager.process();
        expect(capturedCtx?.manager).toBe(manager);
        expect(capturedCtx?.creature).toBe(alice);
    });

    it('think script can start a combat via IManager', () => {
        manager.thinkers.declare('ai-aggro', ({ manager, creature }) => {
            if (!manager.isFighting(creature)) {
                manager.startCombat(creature, bob);
            }
        });
        manager.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, script: 'ai-aggro' });
        manager.process();
        expect(manager.isFighting(alice)).toBe(true);
        expect(manager.getCombatTarget(alice)).toBe(bob);
    });

    it('think script is not called for creatures without PROPERTY_THINK', () => {
        const fn = vi.fn();
        manager.thinkers.declare('ai-basic', fn);
        manager.process();
        expect(fn).not.toHaveBeenCalled();
    });

    it('undeclared think scripts are silently skipped', () => {
        manager.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, script: 'no-such-script' });
        expect(() => manager.process()).not.toThrow();
    });

    it('think enqueues actions that resolve in the same tick as the matching round type', () => {
        const actionFired = vi.fn();
        alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
            if (p.actionId === 'strike') actionFired();
        });
        manager.startCombat(alice, bob);
        const combat = manager['_combatManager'].getCombat(alice)!;
        combat.setDistance(CONSTS.DISTANCE_CLOSE);
        alice.state.actions['strike'] = ActionStateSchema.parse({
            id: 'strike',
            hostile: true,
            script: 'scripts/strike',
            range: CONSTS.DISTANCE_CLOSE,
            cooldown: CooldownManager.create({ duration: 0, charges: 99 }),
            bonus: false,
        });
        manager.thinkers.declare('ai-strike', ({ manager, creature }) => {
            if (!alice.state.actionTaken) {
                manager.doAction(creature, 'strike', bob);
            }
        });
        manager.addCreatureInnateProperty(alice, { type: CONSTS.PROPERTY_THINK, script: 'ai-strike' });
        // tick 1 → bonus round (normal action stays queued for tick 2)
        // tick 2 → normal round fires the queued strike
        manager.process();
        manager.process();
        expect(actionFired).toHaveBeenCalled();
    });
});
