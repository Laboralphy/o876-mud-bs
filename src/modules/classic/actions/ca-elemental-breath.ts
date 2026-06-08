import { IRulesEngine } from '../../../interfaces/IRulesEngine';
import { Creature } from '../../../Creature';
import { doBlastDamage } from '../../base/scripts/helpers';
import { CONSTS } from '../../../consts';
import { CaElementalBreathConfigSchema } from '../../../schemas/actions/ca-elemental-breath';

export function main(
    rules: IRulesEngine,
    subject: Creature,
    target: Creature | undefined,
    config: Record<string, unknown>
) {
    if (!target) {
        return;
    }
    const { damageType, amp } = CaElementalBreathConfigSchema.parse(config);
    doBlastDamage(rules, target, subject, amp, damageType, CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY);
}

export default main;
