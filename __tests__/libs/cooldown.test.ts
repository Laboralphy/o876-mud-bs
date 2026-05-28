import { beforeEach, describe, expect, it } from 'vitest';
import { CooldownManager } from '../../src/libs/cooldown';

describe('CooldownManager', () => {
    // ─── create ───────────────────────────────────────────────────────────────

    describe('create', () => {
        it('starts with an empty timers array', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            expect(cd.timers).toEqual([]);
        });

        it('sets timerMaxCount to charges', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            expect(cd.timerMaxCount).toBe(3);
        });

        it('sets timerMaxValue to duration', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            expect(cd.timerMaxValue).toBe(5);
        });

        it('is active when duration >= 0', () => {
            expect(CooldownManager.create({ duration: 0,  charges: 1 }).active).toBe(true);
            expect(CooldownManager.create({ duration: 10, charges: 1 }).active).toBe(true);
        });

        it('is inactive when duration < 0', () => {
            expect(CooldownManager.create({ duration: -1, charges: 1 }).active).toBe(false);
        });
    });

    // ─── pushTimer ────────────────────────────────────────────────────────────

    describe('pushTimer', () => {
        it('adds one timer entry', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            CooldownManager.pushTimer(cd);
            expect(cd.timers.length).toBe(1);
        });

        it('pushes a timer initialised to timerMaxValue', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            CooldownManager.pushTimer(cd);
            expect(cd.timers[0]).toBe(5);
        });

        it('can push up to timerMaxCount timers', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            expect(cd.timers.length).toBe(3);
        });

        it('does nothing when already at capacity', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 2 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd); // over capacity — should be ignored
            expect(cd.timers.length).toBe(2);
        });

        it('single-charge cooldown blocks after one push', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 1 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd); // ignored
            expect(cd.timers.length).toBe(1);
        });
    });

    // ─── process ──────────────────────────────────────────────────────────────

    describe('process', () => {
        it('decrements every timer by 1', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 3 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            CooldownManager.process(cd);
            expect(cd.timers).toEqual([4, 4]);
        });

        it('removes a timer that reaches 0 after one process', () => {
            const cd = CooldownManager.create({ duration: 1, charges: 2 });
            CooldownManager.pushTimer(cd);
            CooldownManager.process(cd);
            expect(cd.timers.length).toBe(0);
        });

        it('removes a timer after exactly duration process calls', () => {
            const cd = CooldownManager.create({ duration: 3, charges: 2 });
            CooldownManager.pushTimer(cd);
            CooldownManager.process(cd); // 2
            CooldownManager.process(cd); // 1
            expect(cd.timers.length).toBe(1);
            CooldownManager.process(cd); // 0 → removed
            expect(cd.timers.length).toBe(0);
        });

        it('does nothing to an empty timers array', () => {
            const cd = CooldownManager.create({ duration: 5, charges: 2 });
            expect(() => CooldownManager.process(cd)).not.toThrow();
            expect(cd.timers).toEqual([]);
        });

        it('only removes expired timers from the front', () => {
            const cd = CooldownManager.create({ duration: 10, charges: 3 });
            CooldownManager.pushTimer(cd); // timer A: 10
            CooldownManager.process(cd);   // A: 9
            CooldownManager.process(cd);   // A: 8
            CooldownManager.pushTimer(cd); // timer B: 10
            // A still has 8 ticks left, B has 10
            expect(cd.timers).toEqual([8, 10]);
            CooldownManager.process(cd);
            expect(cd.timers).toEqual([7, 9]);
        });
    });

    // ─── multi-charge behaviour ───────────────────────────────────────────────

    describe('multi-charge behaviour', () => {
        it('makes a slot available again once the oldest timer expires', () => {
            const cd = CooldownManager.create({ duration: 2, charges: 2 });
            CooldownManager.pushTimer(cd); // use charge A
            CooldownManager.pushTimer(cd); // use charge B — now full
            expect(cd.timers.length).toBe(2);

            CooldownManager.process(cd); // [1, 1]
            CooldownManager.process(cd); // [0, 0] → both removed
            expect(cd.timers.length).toBe(0);

            CooldownManager.pushTimer(cd); // slot freed — can push again
            expect(cd.timers.length).toBe(1);
        });

        it('staggered pushes expire independently', () => {
            const cd = CooldownManager.create({ duration: 3, charges: 3 });
            CooldownManager.pushTimer(cd); // A: 3
            CooldownManager.process(cd);   // A: 2
            CooldownManager.pushTimer(cd); // B: 3  →  [2, 3]
            CooldownManager.process(cd);   // A: 1, B: 2  →  [1, 2]
            CooldownManager.process(cd);   // A: 0 → removed, B: 1  →  [1]
            expect(cd.timers).toEqual([1]);
            CooldownManager.process(cd);   // B: 0 → removed
            expect(cd.timers).toEqual([]);
        });

        it('blocks all further pushes when all charges are on cooldown', () => {
            const cd = CooldownManager.create({ duration: 10, charges: 2 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            const snapshot = [...cd.timers];
            CooldownManager.pushTimer(cd); // ignored
            expect(cd.timers.length).toBe(snapshot.length);
        });

        it('full cycle: 3 charges, use all, wait for recovery, reuse', () => {
            const cd = CooldownManager.create({ duration: 2, charges: 3 });
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            expect(cd.timers.length).toBe(3); // all charges spent

            CooldownManager.process(cd); // [1,1,1]
            CooldownManager.process(cd); // [0,0,0] → all removed
            expect(cd.timers.length).toBe(0); // all charges recovered

            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            CooldownManager.pushTimer(cd);
            expect(cd.timers.length).toBe(3); // all charges spent again
        });
    });
});
