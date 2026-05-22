import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

// Default BODY = 10, modifier = 0, so d20+0 vs dc:
// dc = 1  → always succeeds (min roll 1 >= 1)
// dc = 21 → always fails    (max roll 20 < 21)

describe('EffectProgramParalysis', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 20;
    });

    function applyParalysis(dc: number, duration = 10) {
        target.state.effects.push({
            id: 'para-1',
            type: CONSTS.EFFECT_PARALYSIS,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_PARALYSIS, dc },
        });
    }

    it('removes paralysis when body resistance check succeeds on damage (dc = 1)', () => {
        applyParalysis(1);
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_PARALYSIS)).toBe(true);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_PARALYSIS)).toBe(false);
    });

    it('keeps paralysis when body resistance check fails on damage (dc = 21)', () => {
        applyParalysis(21);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_PARALYSIS)).toBe(true);
    });

    it('does not check resistance when dc is 0', () => {
        applyParalysis(0);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_PARALYSIS)).toBe(true);
    });

    it('paralysis with no dc field behaves the same as dc = 0', () => {
        target.state.effects.push({
            id: 'para-1',
            type: CONSTS.EFFECT_PARALYSIS,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration: 10,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_PARALYSIS },
        });

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_PARALYSIS)).toBe(true);
    });
});
