import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { CooldownManager } from '../../src/libs/cooldown';
import { ActionStateSchema } from '../../src/schemas/Action';
import { CREATURE_RESREF, makeManager } from './helpers';

function addAction(creature: Creature, id: string, charges = 2): void {
    creature.state.actions[id] = ActionStateSchema.parse({
        id,
        hostile: true,
        script: `scripts/${id}`,
        cooldown: CooldownManager.create({ duration: 10, charges }),
    });
}

describe('Manager — action event', () => {
    let manager: Manager;
    let creature: Creature;
    let target: Creature;

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
        target = manager.createCreature(CREATURE_RESREF);
        addAction(creature, 'fireball');
    });

    describe('EVENT_CREATURE_ACTION', () => {
        it('fires when doAction succeeds', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_ACTION, spy);
            creature.doAction('fireball', target);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature, actionId, script, and target', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_ACTION, spy);
            creature.doAction('fireball', target);
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                actionId: 'fireball',
                script: 'scripts/fireball',
                target,
            });
        });

        it('does not fire when the action is not ready (no charges left)', () => {
            // exhaust all charges
            addAction(creature, 'zap', 1);
            creature.doAction('zap', target);
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_ACTION, spy);
            creature.doAction('zap', target); // second call — no charges left
            expect(spy).not.toHaveBeenCalled();
        });

        it('does not fire for an unknown action id', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_ACTION, spy);
            creature.doAction('unknown-action', target);
            expect(spy).not.toHaveBeenCalled();
        });

        it('consumes one charge per successful call', () => {
            creature.doAction('fireball', target);
            const actions = creature.getters.getActions;
            const fireball = actions.find((a) => a.id === 'fireball')!;
            expect(fireball.charges).toBe(1);
        });

        it('works with undefined target', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_ACTION, spy);
            creature.doAction('fireball', undefined);
            expect(spy).toHaveBeenCalledOnce();
            expect(spy.mock.calls[0][0].target).toBeUndefined();
        });
    });
});
