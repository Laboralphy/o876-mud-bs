import { Creature } from '../../../Creature';
import { IRulesEngine } from '../../../interfaces/IRulesEngine';

/**
 * When a subject is attacking the target with an area of effect, this function can be used to determine
 * the list of creatures in the area of effect that will be affected by the attack.
 * An area of effect is defined as all creatures that share the same distance value from the subject
 * In order to select more than one creature (the target), the subject must be in combat with the target
 * If others creatures than the target, are attacking the subject, they will be included in the area of effect
 * provided that they are at the same distance from the subject.
 * @param rules The RulesEngine instance
 * @param subject The creature that is trying to determiner the list of creature in the area of effect
 * @param target The creature who will be the reference to determine the area of effect
 */
export function getAreaOfEffectCreatures(
    rules: IRulesEngine,
    subject: Creature,
    target: Creature
): Creature[] {
    // checks if distance to target is valid, else return target only
    const distance = rules.getDistanceToCombatTarget(subject);
    if (distance === undefined) {
        return [target];
    }
    // get all creatures that are hostile to the subject
    // The target is guaranteed to be in combat, so distance is valid
    return rules.getCombatAggressors(subject, distance);
}
