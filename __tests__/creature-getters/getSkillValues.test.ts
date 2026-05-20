import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { makeSkillModifierProperty, makeAbilityModifierProperty } from '../helpers/helpers';

describe('getSkillValues', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns 0 for all skills when abilities are average and no bonuses', () => {
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_ATHLETICS]).toBe(0);
        expect(values[CONSTS.SKILL_STEALTH]).toBe(0);
        expect(values[CONSTS.SKILL_ARCANA]).toBe(0);
        expect(values[CONSTS.SKILL_PERSUASION]).toBe(0);
    });

    it('applies the governing ability modifier to all skills of that ability', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_ATHLETICS]).toBe(2);
        expect(values[CONSTS.SKILL_DISCIPLINE]).toBe(2);
        expect(values[CONSTS.SKILL_SURVIVAL]).toBe(2);
        expect(values[CONSTS.SKILL_MARTIAL_EXPERTISE]).toBe(2);
    });

    it('does not apply a Body modifier to skills governed by other abilities', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_STEALTH]).toBe(0);
        expect(values[CONSTS.SKILL_ARCANA]).toBe(0);
        expect(values[CONSTS.SKILL_PERSUASION]).toBe(0);
    });

    it('adds a skill bonus property to the base ability modifier', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 14; // mod +2
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_ATHLETICS));
        expect(creature.getters.getSkillValues[CONSTS.SKILL_ATHLETICS]).toBe(5); // 2 + 3
    });

    it('skill bonus only affects the targeted skill, not siblings of the same ability', () => {
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_ATHLETICS));
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_ATHLETICS]).toBe(3);
        expect(values[CONSTS.SKILL_DISCIPLINE]).toBe(0);
        expect(values[CONSTS.SKILL_SURVIVAL]).toBe(0);
    });

    it('stacks multiple skill bonuses on the same skill', () => {
        creature.state.properties.push(makeSkillModifierProperty(2, CONSTS.SKILL_STEALTH));
        creature.state.properties.push(makeSkillModifierProperty(3, CONSTS.SKILL_STEALTH));
        expect(creature.getters.getSkillValues[CONSTS.SKILL_STEALTH]).toBe(5);
    });

    it('applies independent modifiers across different abilities simultaneously', () => {
        creature.state.abilities[CONSTS.ABILITY_SENSES] = 12; // mod +1
        creature.state.abilities[CONSTS.ABILITY_MIND] = 16;   // mod +3
        creature.state.properties.push(makeSkillModifierProperty(2, CONSTS.SKILL_PERCEPTION));
        creature.state.properties.push(makeSkillModifierProperty(1, CONSTS.SKILL_ARCANA));
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_PERCEPTION]).toBe(3); // 1 + 2
        expect(values[CONSTS.SKILL_ARCANA]).toBe(4);     // 3 + 1
        expect(values[CONSTS.SKILL_ATHLETICS]).toBe(0);
    });

    it('reflects a negative ability modifier', () => {
        creature.state.abilities[CONSTS.ABILITY_PRESENCE] = 6; // mod −2
        const values = creature.getters.getSkillValues;
        expect(values[CONSTS.SKILL_PERSUASION]).toBe(-2);
        expect(values[CONSTS.SKILL_FAITH]).toBe(-2);
    });
});
