import { IRulesEngine } from '../../../interfaces/IRulesEngine';
import { Creature } from '../../../Creature';
import { CONSTS } from '../../../consts';

function main(rules: IRulesEngine, succubus: Creature, target: Creature | undefined): void {
    const oTarget = succubus.rules.getCombatTarget(succubus);
    if (!oTarget) {
        return;
    }
    if (oTarget.getters.getSpecie !== CONSTS.SPECIE_HUMANOID) {
        return;
    }
    if (oTarget.getters.getEffectSet.has(CONSTS.EFFECT_CHARM)) {
        succubus.rules.doAction(succubus, 'act-draining-kiss', target);
    } else if (!oTarget.getters.getImmunities[CONSTS.IMMUNITY_TYPE_CHARM]) {
        succubus.rules.doAction(succubus, 'act-charm', target);
    }
}

export default main;
