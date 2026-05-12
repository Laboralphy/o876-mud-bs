import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { makeEffect, makeRegenEffect } from '../helpers/helpers';

describe('getEffects', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when there are no effects', () => {
        expect(creature.getters.getEffects).toEqual([]);
    });

    it('returns effects with duration > 0', () => {
        creature.state.effects.push(makeEffect({ duration: 3 }));
        expect(creature.getters.getEffects).toHaveLength(1);
    });

    it('filters out effects with duration of 0', () => {
        creature.state.effects.push(makeEffect({ duration: 0 }));
        expect(creature.getters.getEffects).toHaveLength(0);
    });

    it('keeps active effects and discards expired ones', () => {
        creature.state.effects.push(makeEffect({ id: 'a', duration: 5 }));
        creature.state.effects.push(makeEffect({ id: 'b', duration: 0 }));
        creature.state.effects.push(makeEffect({ id: 'c', duration: 1 }));
        const active = creature.getters.getEffects;
        expect(active).toHaveLength(2);
        expect(active.map((e) => e.id)).toEqual(['a', 'c']);
    });
});

describe('getActiveEffects', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns empty array when there are no effects', () => {
        expect(creature.getters.getActiveEffects).toEqual([]);
    });

    it('returns effects that have a registered program', () => {
        creature.state.effects.push(makeRegenEffect());
        expect(creature.getters.getActiveEffects).toHaveLength(1);
    });

    it('filters out effects with no registered program', () => {
        // EFFECT_ABILITY_MODIFIER has no registered program
        creature.state.effects.push(makeEffect({ duration: 5 }));
        expect(creature.getters.getActiveEffects).toHaveLength(0);
    });

    it('only keeps active effects that have a program', () => {
        creature.state.effects.push(makeEffect({ id: 'no-prog', duration: 5 }));
        creature.state.effects.push(makeRegenEffect({ id: 'regen', duration: 5 }));
        const active = creature.getters.getActiveEffects;
        expect(active).toHaveLength(1);
        expect(active[0].id).toBe('regen');
    });

    it('also filters out expired effects', () => {
        creature.state.effects.push(makeRegenEffect({ duration: 0 }));
        expect(creature.getters.getActiveEffects).toHaveLength(0);
    });
});
