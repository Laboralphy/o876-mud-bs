import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSTS } from '../../src/consts';
import { Manager } from '../../src/Manager';
import { Creature } from '../../src/Creature';
import { CREATURE_RESREF, makeManager } from './helpers';

describe('Manager — check events', () => {
    let manager: Manager;
    let creature: Creature;

    beforeEach(() => {
        manager = makeManager();
        creature = manager.createCreature(CREATURE_RESREF);
    });

    describe('EVENT_CREATURE_SKILL_CHECK', () => {
        it('fires when checkSkill is called', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, spy);
            creature.checkSkill(CONSTS.SKILL_ATHLETICS, 10);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature, skill, dc, and outcome', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, spy);
            creature.checkSkill(CONSTS.SKILL_ATHLETICS, 0); // dc=0 always succeeds
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                skill: CONSTS.SKILL_ATHLETICS,
                dc: 0,
            });
        });

        it('fires once per checkSkillAgainst call for each participant', () => {
            const opponent = manager.createCreature(CREATURE_RESREF);
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, spy);
            opponent.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, spy);
            creature.checkSkillAgainst(CONSTS.SKILL_ATHLETICS, opponent, CONSTS.SKILL_ATHLETICS);
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });

    describe('EVENT_CREATURE_RESISTANCE_CHECK', () => {
        it('fires when checkResistance is called', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
            creature.checkResistance(CONSTS.ABILITY_BODY, 10);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('payload includes creature, ability, dc, and outcome', () => {
            const spy = vi.fn();
            creature.events.on(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, spy);
            creature.checkResistance(CONSTS.ABILITY_BODY, 0); // dc=0 always succeeds
            expect(spy.mock.calls[0][0]).toMatchObject({
                creature,
                ability: CONSTS.ABILITY_BODY,
                dc: 0,
            });
        });
    });
});
