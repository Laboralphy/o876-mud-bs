import type { Creature } from '../../Creature';
import { DiceRoll } from '../../DiceRoll';
import { Skill } from '../../schemas/enums/Skill';
import { Ability } from '../../schemas/enums/Ability';
import { Threat } from '../../schemas/enums/Threat';
import { CONSTS } from '../../consts';
import { EventCreatureCheckSkill } from '../../schemas/events/EventCreatureCheckSkill';
import { EventCreatureCheckResistance } from '../../schemas/events/EventCreatureCheckResistance';
import THREAT_RESISTANCE from '../../data/threats.json';

export function rollSkill(creature: Creature, skill: Skill): DiceRoll {
    return new DiceRoll('1d20', creature.getters.getSkillValues[skill]);
}

export function checkSkill(creature: Creature, skill: Skill, dc: number): boolean {
    const d = new DiceRoll('1d20', creature.getters.getSkillValues[skill], dc);
    creature.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
        creature,
        skill,
        dc,
        success: d.success,
    });
    return d.success;
}

export function checkSkillAgainst(creature: Creature, skill: Skill, adversary: Creature, advSkill: Skill): boolean {
    const meDice = rollSkill(creature, skill);
    const advDice = rollSkill(adversary, advSkill);
    const success = meDice.total >= advDice.total;
    creature.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
        creature,
        skill,
        dc: advDice.total,
        success,
    });
    adversary.emit<EventCreatureCheckSkill>(CONSTS.EVENT_CREATURE_SKILL_CHECK, {
        creature: adversary,
        skill: advSkill,
        dc: meDice.total + 1,
        success: advDice.total >= meDice.total + 1,
    });
    return success;
}

export function rollAbilityCheck(creature: Creature, ability: Ability, dc: number): boolean {
    return new DiceRoll('1d20', creature.getters.getAbilityModifiers[ability], dc).success;
}

export function checkResistance(creature: Creature, threat: Threat, dc: number): boolean {
    const TR = THREAT_RESISTANCE as Record<Threat, { resistingSkill?: Skill; resistingAbility?: Ability }>;
    const entry = TR[threat];
    if (!entry) {
        throw new ReferenceError(`Unknown threat: ${threat}`);
    }
    let bonus = 0;
    if (entry.resistingSkill) {
        bonus = creature.getters.getSkillValues[entry.resistingSkill];
    } else if (entry.resistingAbility) {
        bonus = creature.getters.getAbilityModifiers[entry.resistingAbility];
    }
    const d = new DiceRoll('1d20', bonus, dc);
    creature.emit<EventCreatureCheckResistance>(CONSTS.EVENT_CREATURE_RESISTANCE_CHECK, {
        creature,
        threat,
        dc,
        bonus,
        success: d.success,
    });
    return d.success;
}
