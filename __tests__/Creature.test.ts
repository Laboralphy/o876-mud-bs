import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../src/Creature';
import { CONSTS } from '../src/consts';

describe('hitPoints', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    describe('getter', () => {
        it('returns initial value of 1', () => {
            expect(creature.hitPoints).toBe(1);
        });

        it('reflects the value after assignment', () => {
            creature.hitPoints = 50;
            expect(creature.hitPoints).toBe(50);
        });
    });

    describe('setter', () => {
        it('clamps value to 0 at minimum', () => {
            creature.hitPoints = -10;
            expect(creature.hitPoints).toBe(0);
        });

        it('clamps value to max hitpoints at maximum', () => {
            creature.hitPoints = 99999;
            expect(creature.hitPoints).toBe(creature.getters.getMaxHitPoints);
        });

        it('accepts exactly 0', () => {
            creature.hitPoints = 0;
            expect(creature.hitPoints).toBe(0);
        });

        it('accepts exactly max hitpoints', () => {
            const max = creature.getters.getMaxHitPoints;
            creature.hitPoints = max;
            expect(creature.hitPoints).toBe(max);
        });

        it('respects an updated max when body ability changes', () => {
            creature.state.abilities[CONSTS.ABILITY_BODY] = 20;
            const newMax = creature.getters.getMaxHitPoints;
            creature.hitPoints = 99999;
            expect(creature.hitPoints).toBe(newMax);
        });

        it('getter clamps to new max when body ability decreases after hitpoints were set', () => {
            creature.state.abilities[CONSTS.ABILITY_BODY] = 20;
            creature.hitPoints = creature.getters.getMaxHitPoints; // set to full HP
            creature.state.abilities[CONSTS.ABILITY_BODY] = 4;    // max drops
            expect(creature.hitPoints).toBe(creature.getters.getMaxHitPoints);
        });

        it('+= delta increases hitpoints', () => {
            creature.hitPoints = 10;
            creature.hitPoints += 5;
            expect(creature.hitPoints).toBe(15);
        });

        it('+= delta is clamped at max hitpoints', () => {
            const max = creature.getters.getMaxHitPoints;
            creature.hitPoints = max - 1;
            creature.hitPoints += 100;
            expect(creature.hitPoints).toBe(max);
        });

        it('-= delta decreases hitpoints', () => {
            creature.hitPoints = 20;
            creature.hitPoints -= 5;
            expect(creature.hitPoints).toBe(15);
        });

        it('-= delta is clamped at 0', () => {
            creature.hitPoints = 5;
            creature.hitPoints -= 100;
            expect(creature.hitPoints).toBe(0);
        });
    });
});
