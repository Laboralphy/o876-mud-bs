import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { PropertyBuilder } from '../../src/builders/PropertyBuilder';
import { Effect } from '../../src/effects/schemas';
import { ThreatType } from '../../src/schemas/enums/ThreatType';

function makeResistThreatProperty(amp: number, threatType: ThreatType) {
    return PropertyBuilder.buildProperty({
        type: CONSTS.PROPERTY_RESIST_THREAT,
        amp,
        threatType,
    });
}

function makeResistThreatEffect(amp: number, threatType: ThreatType, overrides: Partial<Effect> = {}): Effect {
    return {
        id: 'eff-resist-threat',
        type: CONSTS.EFFECT_RESIST_THREAT,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        duration: 5,
        target: 'creature-1',
        source: 'creature-2',
        siblings: [],
        tag: 'resist-threat-test',
        data: {
            type: CONSTS.EFFECT_RESIST_THREAT,
            amp,
            threatType,
        },
        ...overrides,
    } as Effect;
}

describe('getThreatResistanceBonus', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns 0 for all threat types when no bonuses are applied', () => {
        const values = creature.getters.getThreatResistanceBonus;
        expect(values[CONSTS.THREAT_TYPE_BODY_DECAY]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_CHARM]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_DISEASE]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_FEAR]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_PARALYSIS]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_PETRIFICATION]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_POISON]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_SPELL]).toBe(0);
    });

    it('applies a property bonus to the correct threat type', () => {
        creature.state.properties.push(makeResistThreatProperty(3, CONSTS.THREAT_TYPE_POISON));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_POISON]).toBe(3);
    });

    it('does not bleed a property bonus into other threat types', () => {
        creature.state.properties.push(makeResistThreatProperty(3, CONSTS.THREAT_TYPE_POISON));
        const values = creature.getters.getThreatResistanceBonus;
        expect(values[CONSTS.THREAT_TYPE_FEAR]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_DISEASE]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_CHARM]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_SPELL]).toBe(0);
    });

    it('applies an effect bonus to the correct threat type', () => {
        creature.state.effects.push(makeResistThreatEffect(4, CONSTS.THREAT_TYPE_FEAR));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_FEAR]).toBe(4);
    });

    it('does not bleed an effect bonus into other threat types', () => {
        creature.state.effects.push(makeResistThreatEffect(4, CONSTS.THREAT_TYPE_FEAR));
        const values = creature.getters.getThreatResistanceBonus;
        expect(values[CONSTS.THREAT_TYPE_POISON]).toBe(0);
        expect(values[CONSTS.THREAT_TYPE_SPELL]).toBe(0);
    });

    it('stacks multiple properties on the same threat type', () => {
        creature.state.properties.push(makeResistThreatProperty(2, CONSTS.THREAT_TYPE_DISEASE));
        creature.state.properties.push(makeResistThreatProperty(3, CONSTS.THREAT_TYPE_DISEASE));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_DISEASE]).toBe(5);
    });

    it('stacks multiple effects on the same threat type', () => {
        creature.state.effects.push(makeResistThreatEffect(2, CONSTS.THREAT_TYPE_CHARM, { id: 'e1', tag: 'a' }));
        creature.state.effects.push(makeResistThreatEffect(3, CONSTS.THREAT_TYPE_CHARM, { id: 'e2', tag: 'b' }));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_CHARM]).toBe(5);
    });

    it('combines property and effect bonuses on the same threat type', () => {
        creature.state.properties.push(makeResistThreatProperty(2, CONSTS.THREAT_TYPE_SPELL));
        creature.state.effects.push(makeResistThreatEffect(3, CONSTS.THREAT_TYPE_SPELL));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_SPELL]).toBe(5);
    });

    it('handles bonuses on multiple threat types simultaneously', () => {
        creature.state.properties.push(makeResistThreatProperty(2, CONSTS.THREAT_TYPE_FEAR));
        creature.state.properties.push(makeResistThreatProperty(4, CONSTS.THREAT_TYPE_PARALYSIS));
        creature.state.effects.push(makeResistThreatEffect(1, CONSTS.THREAT_TYPE_PETRIFICATION));
        const values = creature.getters.getThreatResistanceBonus;
        expect(values[CONSTS.THREAT_TYPE_FEAR]).toBe(2);
        expect(values[CONSTS.THREAT_TYPE_PARALYSIS]).toBe(4);
        expect(values[CONSTS.THREAT_TYPE_PETRIFICATION]).toBe(1);
        expect(values[CONSTS.THREAT_TYPE_POISON]).toBe(0);
    });

    it('accepts a negative amp (vulnerability direction)', () => {
        creature.state.properties.push(makeResistThreatProperty(-2, CONSTS.THREAT_TYPE_BODY_DECAY));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_BODY_DECAY]).toBe(-2);
    });

    it('positive and negative bonuses cancel correctly on the same threat type', () => {
        creature.state.properties.push(makeResistThreatProperty(5, CONSTS.THREAT_TYPE_POISON));
        creature.state.effects.push(makeResistThreatEffect(-3, CONSTS.THREAT_TYPE_POISON));
        expect(creature.getters.getThreatResistanceBonus[CONSTS.THREAT_TYPE_POISON]).toBe(2);
    });
});
