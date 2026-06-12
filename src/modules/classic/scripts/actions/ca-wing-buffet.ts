import { IRulesEngine } from '../../../../interfaces/IRulesEngine';
import { Creature } from '../../../../Creature';
import { CONSTS } from '../../../../consts';
import {
    BlastDamageResult,
    doBlastDamage,
    getCreaturesWithinRange,
} from '../../../base/scripts/helpers';

function main(rules: IRulesEngine, subject: Creature, target: Creature | undefined) {
    if (target === undefined) {
        return;
    }
    const creatures = getCreaturesWithinRange(rules, subject, CONSTS.DISTANCE_CLOSE);
    const bdr: BlastDamageResult[] = doBlastDamage(
        rules,
        creatures,
        subject,
        '1d8',
        CONSTS.DAMAGE_TYPE_CRUSHING,
        CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY
    );
    // foreach creature not resisting blast damage, a stun will be applied
    // and a displacement
    bdr.forEach(({ creature, resisted }) => {
        if (!resisted) {
            rules.applyEffect(
                creature,
                {
                    type: CONSTS.EFFECT_STUN,
                },
                subject,
                3,
                CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY
            );
        }
        // Creatures are all at close range
        rules.setDistanceToCombatTarget(target, CONSTS.DISTANCE_MEDIUM);
    });
}

export default main;
