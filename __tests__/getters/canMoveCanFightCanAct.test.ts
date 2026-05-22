import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';
import { Effect } from '../../src/effects/schemas';

function pushEffect(creature: Creature, type: string): void {
    creature.state.effects.push({
        id: `${type}-1`,
        type,
        subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
        duration: 10,
        target: creature.id,
        source: 'source',
        siblings: [],
        tag: '',
        data: { type },
    } as Effect);
}

describe('canMove / canFight / canAct', () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Creature('c1');
    });

    it('all return true for a fresh creature with no effects', () => {
        expect(creature.getters.canMove).toBe(true);
        expect(creature.getters.canFight).toBe(true);
        expect(creature.getters.canAct).toBe(true);
    });

    describe('EFFECT_PARALYSIS', () => {
        beforeEach(() => pushEffect(creature, CONSTS.EFFECT_PARALYSIS));
        it('canMove is false', () => expect(creature.getters.canMove).toBe(false));
        it('canFight is false', () => expect(creature.getters.canFight).toBe(false));
        it('canAct is false', () => expect(creature.getters.canAct).toBe(false));
    });

    describe('EFFECT_PETRIFICATION', () => {
        beforeEach(() => pushEffect(creature, CONSTS.EFFECT_PETRIFICATION));
        it('canMove is false', () => expect(creature.getters.canMove).toBe(false));
        it('canFight is false', () => expect(creature.getters.canFight).toBe(false));
        it('canAct is false', () => expect(creature.getters.canAct).toBe(false));
    });

    describe('EFFECT_STUN', () => {
        beforeEach(() => pushEffect(creature, CONSTS.EFFECT_STUN));
        it('canMove is false', () => expect(creature.getters.canMove).toBe(false));
        it('canFight is false', () => expect(creature.getters.canFight).toBe(false));
        it('canAct is false', () => expect(creature.getters.canAct).toBe(false));
    });

    describe('EFFECT_ROOT', () => {
        beforeEach(() => pushEffect(creature, CONSTS.EFFECT_ROOT));
        it('canMove is false', () => expect(creature.getters.canMove).toBe(false));
        it('canFight is true', () => expect(creature.getters.canFight).toBe(true));
        it('canAct is true', () => expect(creature.getters.canAct).toBe(true));
    });

    describe('EFFECT_FEAR', () => {
        beforeEach(() => pushEffect(creature, CONSTS.EFFECT_FEAR));
        it('canMove is true', () => expect(creature.getters.canMove).toBe(true));
        it('canFight is false', () => expect(creature.getters.canFight).toBe(false));
        it('canAct is true', () => expect(creature.getters.canAct).toBe(true));
    });
});
