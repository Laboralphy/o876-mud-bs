import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

describe('getAbilityBaseValues', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('test');
    });

    it('returns default value of 10 for all abilities', () => {
        expect(creature.getters.getAbilityBaseValues).toEqual({
            [CONSTS.ABILITY_BODY]: 10,
            [CONSTS.ABILITY_SENSES]: 10,
            [CONSTS.ABILITY_MIND]: 10,
            [CONSTS.ABILITY_PRESENCE]: 10,
        });
    });

    it('reflects a modified body value', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 18;
        expect(creature.getters.getAbilityBaseValues).toEqual({
            [CONSTS.ABILITY_BODY]: 18,
            [CONSTS.ABILITY_SENSES]: 10,
            [CONSTS.ABILITY_MIND]: 10,
            [CONSTS.ABILITY_PRESENCE]: 10,
        });
    });

    it('reflects independently modified abilities', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 8;
        creature.state.abilities[CONSTS.ABILITY_SENSES] = 14;
        creature.state.abilities[CONSTS.ABILITY_MIND] = 16;
        creature.state.abilities[CONSTS.ABILITY_PRESENCE] = 12;
        expect(creature.getters.getAbilityBaseValues).toEqual({
            [CONSTS.ABILITY_BODY]: 8,
            [CONSTS.ABILITY_SENSES]: 14,
            [CONSTS.ABILITY_MIND]: 16,
            [CONSTS.ABILITY_PRESENCE]: 12,
        });
    });

    it('each creature has its own independent state', () => {
        const other = new Creature('other');
        creature.state.abilities[CONSTS.ABILITY_BODY] = 18;
        expect(creature.getters.getAbilityBaseValues[CONSTS.ABILITY_BODY]).toBe(18);
        expect(other.getters.getAbilityBaseValues[CONSTS.ABILITY_BODY]).toBe(10);
    });

    it('reflects ability set to minimum value of 0', () => {
        creature.state.abilities[CONSTS.ABILITY_BODY] = 0;
        expect(creature.getters.getAbilityBaseValues[CONSTS.ABILITY_BODY]).toBe(0);
    });
});
