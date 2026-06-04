import { IManager } from '../../../interfaces/IManager';
import { Creature } from '../../../Creature';
import { CONSTS } from '../../../consts';

function main(manager: IManager, succubus: Creature, target: Creature | undefined): void {
    const oTarget = succubus.manager.getCombatTarget(succubus);
    if (!oTarget) {
        return;
    }
    if (oTarget.getters.getSpecie !== CONSTS.SPECIE_HUMANOID) {
        return;
    }
    if (oTarget.getters.getEffectSet.has(CONSTS.EFFECT_CHARM)) {
        succubus.manager.doAction(succubus, 'act-draining-kiss', target);
    } else if (!oTarget.getters.getImmunities[CONSTS.IMMUNITY_TYPE_CHARM]) {
        succubus.manager.doAction(succubus, 'act-charm', target);
    }
}

export default main;
