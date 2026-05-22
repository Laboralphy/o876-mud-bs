import skillsData from '../../data/skills.json';
import { Skill } from '../../schemas/enums/Skill';
import { EffectType } from '../../schemas/enums/EffectType';

const effectToSkill = Object.fromEntries(
    Object.entries(skillsData)
        .filter(([, def]) => def.resistance !== null)
        .map(([skill, def]) => [def.resistance, skill])
) as Partial<Record<EffectType, Skill>>;

export function getResistingSkill(effectType: EffectType): Skill | null {
    return effectToSkill[effectType] ?? null;
}
