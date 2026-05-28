import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { CREATURE_RESREF, makeManager } from './helpers';

describe('Manager — combat events', () => {
    let manager: Manager;
    let creature: Creature;
    let source: Creature;

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
        source = manager.createCreature(CREATURE_RESREF);
    });

    describe('EVENT_CREATURE_DAMAGED', () => {
        it('fires when triggerDamagedEvent is called', () => {
            creature.hitPoints = 20;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_DAMAGED, spy);
            creature.triggerDamagedEvent(5, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature, amount, damageType, and source', () => {
            creature.hitPoints = 20;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_DAMAGED, spy);
            creature.triggerDamagedEvent(5, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                amount: 5,
                damageType: CONSTS.DAMAGE_TYPE_SLASHING,
                source,
            });
        });
    });

    describe('EVENT_CREATURE_HEAL', () => {
        it('fires when a heal effect is applied to an injured creature', () => {
            creature.hitPoints = 5;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_HEAL, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_HEAL, amp: 10 }, source, 0);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature, amount healed, and healer', () => {
            creature.hitPoints = 5;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_HEAL, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_HEAL, amp: 10 }, source, 0);
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                healer: source,
            });
            expect(spy.mock.calls[0][0].amount).toBeGreaterThan(0);
        });

        it('does not fire when amp is 0 (nothing to heal)', () => {
            creature.hitPoints = 5;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_HEAL, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_HEAL, amp: 0 }, source, 0);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('EVENT_CREATURE_DEATH', () => {
        // triggerDamagedEvent does not reduce HP — it notifies after damage is applied.
        // Drive the creature to 0 HP before calling it.

        it('fires when hitPoints are at 0 and triggerDamagedEvent is called', () => {
            creature.hitPoints = 0;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_DEATH, spy);
            creature.triggerDamagedEvent(1, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature and killer', () => {
            creature.hitPoints = 0;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_DEATH, spy);
            creature.triggerDamagedEvent(1, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(spy.mock.calls[0][0]).toMatchObject({ creature, killer: source });
        });

        it('keeps the creature in the Manager registry (corpse remains until destroyCreature is called)', () => {
            const id = creature.id;
            creature.hitPoints = 0;
            creature.triggerDamagedEvent(1, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(manager.getCreature(id)).toBe(creature);
        });

        it('does not fire when hitPoints are still above 0', () => {
            creature.hitPoints = 20;
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_DEATH, spy);
            creature.triggerDamagedEvent(5, CONSTS.DAMAGE_TYPE_SLASHING, source);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
