/**
 * This action is used to deal damage to the target creatures and all creatures that are hostile to the subject
 */
import { IRulesEngine } from '../../../interfaces/IRulesEngine';
import { Creature } from '../../../Creature';
import { doDamage, getAreaOfEffectCreatures } from '../../base/scripts/helpers';

export function main(rules: IRulesEngine, subject: Creature, target: Creature | undefined) {
    if (!target) {
        return;
    }
    // get all involved creature
    const aCreatures = getAreaOfEffectCreatures(rules, subject, target);
    // deal damage to all creatures
    aCreatures.forEach((creature) => {
        doDamage();
    });
}

export default main;
