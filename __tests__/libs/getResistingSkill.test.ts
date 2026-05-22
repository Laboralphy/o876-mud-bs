import { describe, it, expect } from 'vitest';
import { getResistingSkill } from '../../src/libs/get-resisting-skill';
import { CONSTS } from '../../src/consts';

describe('getResistingSkill', () => {
    it('returns SKILL_ATHLETICS for EFFECT_PARALYSIS', () => {
        expect(getResistingSkill(CONSTS.EFFECT_PARALYSIS)).toBe(CONSTS.SKILL_ATHLETICS);
    });

    it('returns SKILL_ACROBATICS for EFFECT_ROOT', () => {
        expect(getResistingSkill(CONSTS.EFFECT_ROOT)).toBe(CONSTS.SKILL_ACROBATICS);
    });

    it('returns SKILL_DISCIPLINE for EFFECT_STUN', () => {
        expect(getResistingSkill(CONSTS.EFFECT_STUN)).toBe(CONSTS.SKILL_DISCIPLINE);
    });

    it('returns SKILL_ALCHEMY for EFFECT_POISON', () => {
        expect(getResistingSkill(CONSTS.EFFECT_POISON)).toBe(CONSTS.SKILL_ALCHEMY);
    });

    it('returns SKILL_SURVIVAL for EFFECT_DISEASE', () => {
        expect(getResistingSkill(CONSTS.EFFECT_DISEASE)).toBe(CONSTS.SKILL_SURVIVAL);
    });

    it('returns SKILL_FAITH for EFFECT_FEAR', () => {
        expect(getResistingSkill(CONSTS.EFFECT_FEAR)).toBe(CONSTS.SKILL_FAITH);
    });

    it('returns SKILL_AURA for EFFECT_CHARM', () => {
        expect(getResistingSkill(CONSTS.EFFECT_CHARM)).toBe(CONSTS.SKILL_AURA);
    });

    it('returns null for an effect with no resisting skill', () => {
        expect(getResistingSkill(CONSTS.EFFECT_DAMAGE)).toBeNull();
    });
});
