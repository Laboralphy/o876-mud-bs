import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { Manager } from '../../src/Manager';
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

    it('creature.manager throws after destroyCreature', () => {
        manager.destroyCreature(alice);
        expect(() => alice.manager).toThrow();
    });

    it('PROPERTY_THINK is a valid property type', () => {
        expect(CONSTS.PROPERTY_THINK).toBe('PROPERTY_THINK');
    });

    it('mutate script is called during process() for creatures with PROPERTY_THINK', () => {
        const fn = vi.fn();
        manager.scripts.declareScript('ai-basic', fn);
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-basic',
        });
        manager.process();
        expect(fn).toHaveBeenCalledOnce();
    });

    it('mutate script receives creature in context', () => {
        let capturedCtx: { creature: Creature } | undefined;
        manager.scripts.declareScript('ai-inspect', (creature: Creature) => {
            capturedCtx = { creature };
        });
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-inspect',
        });
        manager.process();
        expect(capturedCtx?.creature).toBe(alice);
    });

    it('mutate script can start a combat via creature.manager', () => {
        manager.scripts.declareScript('ai-aggro', (creature: Creature) => {
            if (!creature.manager.isFighting(creature)) {
                creature.manager.startCombat(creature, bob);
            }
        });
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-aggro',
        });
        manager.process();
        expect(manager.isFighting(alice)).toBe(true);
        expect(manager.getCombatTarget(alice)).toBe(bob);
    });

    it('undeclared thinker scripts are silently skipped', () => {
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'no-such-script',
        });
        expect(() => manager.process()).not.toThrow();
    });

    it('scripts without the matching hook are not called', () => {
        const fn = vi.fn();
        manager.scripts.declareScript('ai-attack-only', fn);
        // only 'attack' hook wired, not 'mutate'
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            attack: 'ai-attack-only',
        });
        manager.process();
        expect(fn).not.toHaveBeenCalled();
    });

    it('mutate enqueues actions that resolve in the matching round', () => {
        const actionFired = vi.fn();
        alice.events.on(CONSTS.EVENT_CREATURE_ACTION, (p: { actionId: string }) => {
            if (p.actionId === 'strike') {
                actionFired();
            }
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
        manager.scripts.declareScript('ai-strike', (creature: Creature) => {
            if (!creature.state.actionTaken) {
                creature.manager.doAction(creature, 'strike', bob);
            }
        });
        manager.addCreatureInnateProperty(alice, {
            type: CONSTS.PROPERTY_THINK,
            mutate: 'ai-strike',
        });
        // tick 1 → bonus round; tick 2 → normal round fires the queued strike
        manager.process();
        manager.process();
        expect(actionFired).toHaveBeenCalled();
    });
});
