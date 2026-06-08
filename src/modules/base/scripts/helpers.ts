import { Creature } from '../../../Creature';
import { IRulesEngine } from '../../../interfaces/IRulesEngine';
import { DamageType } from '../../../schemas/enums/DamageType';
import { EffectSubtype } from '../../../schemas/enums/EffectSubtype';
import { CONSTS } from '../../../consts';
import { Ability } from '../../../schemas/enums/Ability';
import { Skill } from '../../../schemas/enums/Skill';

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

export function doDamage(
    rules: IRulesEngine,
    target: Creature,
    source: Creature,
    amount: number | string,
    damageType: DamageType,
    effectSubType: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
) {
    return rules.applyEffect(
        target,
        {
            type: CONSTS.EFFECT_DAMAGE,
            amp: target.dice.roll(amount),
            damageType,
        },
        source,
        0,
        effectSubType
    );
}

export function doBlastDamage(
    rules: IRulesEngine,
    target: Creature,
    source: Creature,
    amount: number | string,
    damageType: DamageType,
    effectSubType: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
) {
    const creatures = getAreaOfEffectCreatures(rules, source, target);
    const ability: Ability =
        effectSubType == CONSTS.EFFECT_SUBTYPE_MAGICAL
            ? CONSTS.ABILITY_MIND
            : CONSTS.ABILITY_SENSES;
    for (const creature of creatures) {
        let nThisAmount = creature.dice.roll(amount);
        // check resistance
        if (source.rollThreat(CONSTS.THREAT_BLAST, ability, creature)) {
            // blast has been resisted : halves damage
            nThisAmount = Math.ceil(nThisAmount / 2);
        }
        // apply damage
        doDamage(rules, creature, source, nThisAmount, damageType, effectSubType);
    }
}

export function doHeal(
    rules: IRulesEngine,
    target: Creature,
    healer: Creature,
    amount: number | string,
    effectSubType: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
) {
    return rules.applyEffect(
        target,
        {
            type: CONSTS.EFFECT_HEAL,
            amp: target.dice.roll(amount),
        },
        healer,
        0,
        effectSubType
    );
}
