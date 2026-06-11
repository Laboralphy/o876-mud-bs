import { IRulesEngine } from '../../../../interfaces/IRulesEngine';
import { Creature } from '../../../../Creature';
import { getAreaOfEffectCreatures } from '../../../base/scripts/helpers';
import { CONSTS } from '../../../../consts';

function main(rules: IRulesEngine, subject: Creature, target: Creature | undefined) {
    if (!target) {
        return;
    }
    const duration = 3;
    getAreaOfEffectCreatures(rules, subject, target).forEach((offender) => {
        const success = offender.rollThreat(CONSTS.THREAT_FEAR, CONSTS.ABILITY_PRESENCE, offender);
        if (!success) {
            rules.applyEffect(
                offender,
                {
                    type: CONSTS.EFFECT_FEAR,
                },
                subject,
                duration,
                CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY
            );
        }
    });
}

export default main;
