import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { makeSkillModifierProperty, makeAbilityModifierProperty } from '../helpers/helpers';

describe('getResistanceValues', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns 0 for all resistances when abilities are average and no bonuses', () => {
        const values = creature.getters.getResistanceValues;
        expect(values[CONSTS.ABILITY_BODY]).toBe(0);
        expect(values[CONSTS.ABILITY_SENSES]).toBe(0);
        expect(values[CONSTS.ABILITY_MIND]).toBe(0);
        expect(values[CONSTS.ABILITY_PRESENCE]).toBe(0);
    });

    it('reflects the ability modifier for its resistance category', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_BODY]).toBe(2);
    });

    it('does not bleed a Body modifier into other resistance categories', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14;
        const values = creature.getters.getResistanceValues;
        expect(values[CONSTS.ABILITY_SENSES]).toBe(0);
        expect(values[CONSTS.ABILITY_MIND]).toBe(0);
        expect(values[CONSTS.ABILITY_PRESENCE]).toBe(0);
    });

    it('adds a skill bonus to the resistance of its governing ability', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_ATHLETICS));
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_BODY]).toBe(5); // 2 + 3
    });

    it('sums all skill bonuses for the same ability', () => {
        creature.state.properties.push(makeSkillModifierProperty(2, CONSTS.SKILL_ATHLETICS));
        creature.state.properties.push(makeSkillModifierProperty(1, CONSTS.SKILL_DISCIPLINE));
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_SURVIVAL));
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_BODY]).toBe(6); // 0 + 2 + 1 + 3
    });

    it('routes skill bonuses to the correct ability only', () => {
        creature.state.properties.push(makeSkillModifierProperty(4, CONSTS.SKILL_STEALTH));   // Senses
        creature.state.properties.push(makeSkillModifierProperty(2, CONSTS.SKILL_ARCANA));    // Mind
        const values = creature.getters.getResistanceValues;
        expect(values[CONSTS.ABILITY_BODY]).toBe(0);
        expect(values[CONSTS.ABILITY_SENSES]).toBe(4);
        expect(values[CONSTS.ABILITY_MIND]).toBe(2);
        expect(values[CONSTS.ABILITY_PRESENCE]).toBe(0);
    });

    it('combines ability modifier and skill bonuses across all four abilities', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 12;     // mod +1
        creature.state.abilities[CONSTS.ABILITY_SENSES] = 14;   // mod +2
        creature.state.abilities[CONSTS.ABILITY_MIND] = 8;      // mod −1
        creature.state.abilities[CONSTS.ABILITY_PRESENCE] = 16; // mod +3
        creature.state.properties.push(makeSkillModifierProperty(2, CONSTS.SKILL_ATHLETICS));
        creature.state.properties.push(makeSkillModifierProperty(1, CONSTS.SKILL_PERCEPTION));
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_FAITH));
        const values = creature.getters.getResistanceValues;
        expect(values[CONSTS.ABILITY_BODY]).toBe(3);      // 1 + 2
        expect(values[CONSTS.ABILITY_SENSES]).toBe(3);    // 2 + 1
        expect(values[CONSTS.ABILITY_MIND]).toBe(-1);     // −1 + 0
        expect(values[CONSTS.ABILITY_PRESENCE]).toBe(6);  // 3 + 3
    });

    it('reflects a negative ability modifier', () => {
        creature.state.abilities[CONSTS.ABILITY_MIND] = 6; // mod −2
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_MIND]).toBe(-2);
    });

    it('a skill bonus does not offset resistance if routed to a different ability', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 6; // mod −2
        creature.state.properties.push(makeSkillModifierProperty(5, CONSTS.SKILL_ARCANA)); // Mind skill
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_BODY]).toBe(-2);
        expect(creature.getters.getResistanceValues[CONSTS.ABILITY_MIND]).toBe(5);
    });
});
