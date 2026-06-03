import { Creature } from '@/Creature';
import { CONSTS } from '@/consts';

function main(succubus: Creature, target: Creature): void {
    // is there a target?
    const oTarget = succubus.manager.getCombatTarget(succubus);
    if (!oTarget) {
        return;
    }
    // is the target humanoid?
    if (oTarget.getters.getSpecie !== CONSTS.SPECIE_HUMANOID) {
        return;
    }
    // is the target charmed?
    if (oTarget.getters.getEffectSet.has(CONSTS.EFFECT_CHARM)) {
        // then draining kiss
        succubus.manager.doAction(succubus, 'act-draining-kiss', target);
    } else if (!oTarget.getters.getImmunities[CONSTS.IMMUNITY_TYPE_CHARM]) {
        // target not charmed, check charm immunity, then charm
        succubus.manager.doAction(succubus, 'act-charm', target);
    }
}

module.exports = main;
