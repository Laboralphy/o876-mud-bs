import { beforeEach, describe, expect, it } from 'vitest';
import { Creature } from '../../src/Creature';
import { Attack } from '../../src/Attack';
import { CONSTS } from '../../src/consts';

describe('EffectProgramCharm', () => {
    let charmer: Creature;
    let target: Creature;
    let thirdParty: Creature;

    beforeEach(() => {
        charmer = new Creature('charmer');
        target = new Creature('target');
        thirdParty = new Creature('third-party');
        target.hitPoints = 20;
    });

    function applyCharm(dc: number, duration = 10) {
        target.state.effects.push({
            id: 'charm-1',
            type: CONSTS.EFFECT_CHARM,
            subtype: CONSTS.EFFECT_SUBTYPE_MAGICAL,
            duration,
            target: target.id,
            source: charmer.id,
            siblings: [],
            tag: '',
            data: { type: CONSTS.EFFECT_CHARM, dc },
        });
    }

    it('removes charm when aura check succeeds and attacker is the charm source (dc = 1)', () => {
        applyCharm(1);
        target.triggerAttackedEvent(new Attack(charmer, target));
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(false);
    });

    it('keeps charm when aura check fails and attacker is the charm source (dc = 21)', () => {
        applyCharm(21);
        target.triggerAttackedEvent(new Attack(charmer, target));
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);
    });

    it('does not check aura when dc is 0', () => {
        applyCharm(0);
        target.triggerAttackedEvent(new Attack(charmer, target));
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);
    });

    it('does not check aura when attacker is not the charm source', () => {
        applyCharm(1);
        target.triggerAttackedEvent(new Attack(thirdParty, target));
        expect(target.state.effects.some((e) => e.type === CONSTS.EFFECT_CHARM)).toBe(true);
    });
});
