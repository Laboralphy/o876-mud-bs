import { IRulesEngine } from '../../../../interfaces/IRulesEngine';
import { Creature } from '../../../../Creature';
import { CONSTS } from '../../../../consts';
import { doBlastDamage } from '../../../base/scripts/helpers';

function main(rules: IRulesEngine, subject: Creature, target: Creature | undefined) {
    if (target === undefined) {
        return;
    }
    doBlastDamage(
        rules,
        target,
        subject,
        '1d8',
        CONSTS.DAMAGE_TYPE_CRUSHING,
        CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY
    );
}

export default main;
