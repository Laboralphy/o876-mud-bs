import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { CREATURE_RESREF, makeManager } from './helpers';

describe('Manager — effect events', () => {
    let manager: Manager;
    let creature: Creature;
    let source: Creature;

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
        source = manager.createCreature(CREATURE_RESREF);
    });

    describe('EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED', () => {
        it('fires when an effect is applied to a creature', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_ABILITY_MODIFIER, amp: 2, ability: CONSTS.ABILITY_BODY }, source, 5);
            expect(spy).toHaveBeenCalledOnce();
            expect(spy.mock.calls[0][0]).toMatchObject({ creature });
        });

        it('is not fired when the creature is immune to the effect', () => {
            creature.addInnateProperty({ type: CONSTS.PROPERTY_IMMUNITY, immunityType: CONSTS.IMMUNITY_TYPE_CHARM } as never);
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_CHARM }, source, 5);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED', () => {
        it('fires when an active effect expires after one process tick', () => {
            const spy = vi.fn();
            creature.applyEffect({ type: CONSTS.EFFECT_ABILITY_MODIFIER, amp: 2, ability: CONSTS.ABILITY_BODY }, source, 1);
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, spy);
            creature.process();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy.mock.calls[0][0]).toMatchObject({ creature });
        });

        it('does not fire when the effect still has duration remaining', () => {
            const spy = vi.fn();
            creature.applyEffect({ type: CONSTS.EFFECT_ABILITY_MODIFIER, amp: 2, ability: CONSTS.ABILITY_BODY }, source, 3);
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED, spy);
            creature.process();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY', () => {
        it('fires on every applyEffect call regardless of immunity status', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, spy);
            creature.applyEffect({ type: CONSTS.EFFECT_ABILITY_MODIFIER, amp: 1, ability: CONSTS.ABILITY_BODY }, source, 5);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes an immune callback that overrides immunity when called', () => {
            let capturedImmune: ((b: boolean) => void) | undefined;
            creature.events.on(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, ({ immune }) => {
                capturedImmune = immune;
                immune(true); // force immune
            });
            creature.applyEffect({ type: CONSTS.EFFECT_ABILITY_MODIFIER, amp: 5, ability: CONSTS.ABILITY_BODY }, source, 5);
            // effect was blocked so no active effects
            expect(creature.getters.getActiveEffects).toHaveLength(0);
            expect(capturedImmune).toBeTypeOf('function');
        });
    });
});
