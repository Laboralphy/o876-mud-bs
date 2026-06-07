import THREAT_RESISTANCE from '../../data/threat-resistance.json';
import { Skill } from '../../schemas/enums/Skill';
import { EffectType } from '../../schemas/enums/EffectType';

const effectToSkill: Partial<Record<string, string>> = {};
for (const entry of Object.values(THREAT_RESISTANCE)) {
    if (entry.resistingSkill) {
        for (const effect of entry.effects) {
            effectToSkill[effect] = entry.resistingSkill;
        }
    }
}

export function getResistingSkill(effectType: EffectType): Skill | null {
    return (effectToSkill[effectType] as Skill) ?? null;
}
