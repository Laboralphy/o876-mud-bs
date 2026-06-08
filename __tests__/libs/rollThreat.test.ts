import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { Creature } from '../../src/Creature';
import { RulesEngine } from '../../src/RulesEngine';
import { CONSTS } from '../../src/consts';
import { CREATURE_RESREF, makeRulesEngine } from '../RulesEngine/helpers';
import { VARS } from '../../src/vars';

// Force 1d20 to roll minimum (1)
function forceMinRoll() {
    vi.spyOn(Math, 'random').mockReturnValue(0);
}

// Force 1d20 to roll maximum (20)
function forceMaxRoll() {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999);
}

describe('rollThreat', () => {
    let rules: RulesEngine;
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        rules = makeRulesEngine();
        attacker = rules.createCreature(CREATURE_RESREF); // ABILITY_PRESENCE = 10 → modifier 0
        target = rules.createCreature(CREATURE_RESREF);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns true when target fails to resist (forced low roll)', () => {
        forceMinRoll(); // target rolls 1, dc=8 → fails
        expect(attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target)).toBe(true);
    });

    it('returns false when target resists (forced high roll)', () => {
        forceMaxRoll(); // target rolls 20, dc=8 → resists
        expect(attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target)).toBe(false);
    });

    it('base DC is 8 + ability modifier', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS); // ability 10 → modifier 0
    });

    it('PROPERTY_THREAT_POWER matching threat increases DC', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        attacker.addInnateProperty({ type: CONSTS.PROPERTY_THREAT_POWER, threat: CONSTS.THREAT_CHARM, amp: 3 });
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS + 3);
    });

    it('PROPERTY_THREAT_POWER for a different threat does not increase DC', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        attacker.addInnateProperty({ type: CONSTS.PROPERTY_THREAT_POWER, threat: CONSTS.THREAT_POISON, amp: 3 });
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS); // THREAT_POISON bonus doesn't apply
    });

    it('EFFECT_THREAT_POWER matching threat increases DC', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        attacker.applyEffect({ type: CONSTS.EFFECT_THREAT_POWER, threat: CONSTS.THREAT_CHARM, amp: 4 }, attacker, 5);
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS + 4);
    });

    it('property and effect bonuses stack', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        attacker.addInnateProperty({ type: CONSTS.PROPERTY_THREAT_POWER, threat: CONSTS.THREAT_CHARM, amp: 3 });
        attacker.applyEffect({ type: CONSTS.EFFECT_THREAT_POWER, threat: CONSTS.THREAT_CHARM, amp: 4 }, attacker, 5);
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS + 3 + 4);
    });

    it('higher offensive ability modifier raises DC', () => {
        const spy = vi.fn();
        target.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
        // ABILITY_PRESENCE = 16 → modifier +3
        attacker.state.abilities[CONSTS.ABILITY_PRESENCE] = 16;
        attacker.rollThreat(CONSTS.THREAT_CHARM, CONSTS.ABILITY_PRESENCE, target);
        expect(spy.mock.calls[0][0].dc).toBe(VARS.BASE_DIFFICULTY_CLASS + 3);
    });
});
