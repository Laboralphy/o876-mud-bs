import { IRulesEngine } from '../../../../interfaces/IRulesEngine';
import { Creature } from '../../../../Creature';
import { doBlastDamage } from '../../../base/scripts/helpers';
import { CONSTS } from '../../../../consts';
import { DamageType } from '../../../../schemas/enums/DamageType';

type CaElementalBreathConfig = {
    damageType: DamageType;
    amp: number | string;
};

/**
 * An elemental breath is a stream of elemental energy emited by a creature to an Area around the target
 * @param rules
 * @param subject
 * @param target
 * @param config
 */
function main(
    rules: IRulesEngine,
    subject: Creature,
    target: Creature | undefined,
    config: CaElementalBreathConfig
) {
    if (!target) {
        return;
    }
    const { damageType = CONSTS.DAMAGE_TYPE_THERMAL, amp = '1d6' } = config;
    doBlastDamage(rules, target, subject, amp, damageType, CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY);
}

export default main;
