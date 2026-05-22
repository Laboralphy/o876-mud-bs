import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { CONSTS } from '../../src/consts';

describe('EffectProgramCharm', () => {
    let attacker: Creature;
    let target: Creature;

    beforeEach(() => {
        attacker = new Creature('attacker');
        target = new Creature('target');
        target.hitPoints = 20;
    });

    function applyCharm(dc: number, duration = 10) {
        target.state.effects.push({
            id: 'charm-1',
            type: CONSTS.EFFECT_CHARM,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration,
            target: target.id,
            source: attacker.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_CHARM, dc },
        });
    }

    it('removes charm when aura check succeeds on damage (dc = 1)', () => {
        applyCharm(1);
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(false);
    });

    it('keeps charm when aura check fails on damage (dc = 21)', () => {
        applyCharm(21);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);
    });

    it('does not check resistance when dc is 0', () => {
        applyCharm(0);

        target.applyEffect(
            { type: CONSTS.EFFECT_DAMAGE, damageType: CONSTS.DAMAGE_TYPE_SLASHING, amp: 3 },
            attacker, 0
        );

        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);
    });
});
