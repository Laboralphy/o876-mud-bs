import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

function makeRegenProperty(vulnerabilities: string[]) {
    return {
        type: CONSTS.PROPERTY_REGENERATION,
        amp: 1,
        vulnerabilities,
        useBodyModifier: false,
        shutdown: 0,
        threshold: 1,
    } as const;
}

function getShutdown(creature: Creature): number {
    const prop = creature.state.properties.find(p => p.type === CONSTS.PROPERTY_REGENERATION);
    return prop?.shutdown ?? 0;
}

describe('PropertyProgramRegeneration - mutate', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('increases hitPoints by amp when below max', () => {
        // default max HP = body(10) * 8 + 20 = 100
        creature.addInnateProperty({
            type: CONSTS.PROPERTY_REGENERATION,
            amp: 1,
            vulnerabilities: [],
            useBodyModifier: false,
            shutdown: 0,
            threshold: 1, // regenerate whenever hp < 100% of max
        });
        creature.hitPoints = 10;
        creature.triggerMutateEvent();
        expect(creature.hitPoints).toBe(11);
    });

    it('stops regenerating once hitPoints reaches the threshold fraction of max', () => {
        // max HP = 100, threshold = 0.5 → regeneration stops when hp/max >= 0.5 (i.e. at 50)
        creature.addInnateProperty({
            type: CONSTS.PROPERTY_REGENERATION,
            amp: 1,
            vulnerabilities: [],
            useBodyModifier: false,
            shutdown: 0,
            threshold: 0.5,
        });
        creature.hitPoints = 10;
        for (let i = 0; i < 100; i++) {
            creature.triggerMutateEvent();
        }
        expect(creature.getters.getMaxHitPoints).toBe(100);
        expect(creature.hitPoints).toBe(50);
    });

    it('stops regenerating once hitPoints reaches the threshold fraction of max - variable amp', () => {
        // max HP = 100, threshold = 0.5 → regeneration stops when hp/max >= 0.5 (i.e. at 50)
        // With variable dice (1d6), the last roll may overshoot the exact threshold value,
        // so we only check that regen stopped (additional ticks don't change HP).
        creature.addInnateProperty({
            type: CONSTS.PROPERTY_REGENERATION,
            amp: '1d6',
            vulnerabilities: [],
            useBodyModifier: false,
            shutdown: 0,
            threshold: 0.5,
        });
        creature.hitPoints = 10;
        for (let i = 0; i < 100; i++) {
            creature.triggerMutateEvent();
        }
        expect(creature.getters.getMaxHitPoints).toBe(100);
        const hpAtStop = creature.hitPoints;
        expect(hpAtStop).toBeGreaterThanOrEqual(50); // threshold was crossed
        // Further ticks must not increase HP (regen stopped above threshold)
        creature.triggerMutateEvent();
        creature.triggerMutateEvent();
        expect(creature.hitPoints).toBe(hpAtStop);
    });
});

describe('PropertyProgramRegeneration - damaged', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('increases shutdown by the damage amount when hit by a vulnerable damage type', () => {
        creature.addInnateProperty(makeRegenProperty([CONSTS.DAMAGE_TYPE_THERMAL]));
        creature.triggerDamagedEvent(10, CONSTS.DAMAGE_TYPE_THERMAL, undefined);
        expect(getShutdown(creature)).toBe(10);
    });

    it('does not increase shutdown when hit by a non-vulnerable damage type', () => {
        creature.addInnateProperty(makeRegenProperty([CONSTS.DAMAGE_TYPE_THERMAL]));
        creature.triggerDamagedEvent(10, CONSTS.DAMAGE_TYPE_SLASHING, undefined);
        expect(getShutdown(creature)).toBe(0);
    });

    it('accumulates shutdown across multiple hits of a vulnerable damage type', () => {
        creature.addInnateProperty(makeRegenProperty([CONSTS.DAMAGE_TYPE_THERMAL]));
        creature.triggerDamagedEvent(10, CONSTS.DAMAGE_TYPE_THERMAL, undefined);
        creature.triggerDamagedEvent(5, CONSTS.DAMAGE_TYPE_THERMAL, undefined);
        expect(getShutdown(creature)).toBe(15);
    });
});
