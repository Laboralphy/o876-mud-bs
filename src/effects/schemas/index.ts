import z from 'zod';
import { EffectAbilityCheckModifier } from './ability-check-modifier';
import { EffectAbilityModifier } from './ability-modifier';
import { EffectAbilityResistanceModifier } from './ability-resistance-modifier';
import { EffectArmorClassModifier } from './armor-class-modifier';
import { EffectAttackModifier } from './attack-modifier';
import { EffectBlindness } from './blindness';
import { EffectCharm } from './charm';
import { EffectDamageImmunity } from './damage-immunity';
import { EffectDamageModifier } from './damage-modifier';
import { EffectDamageReduction } from './damage-reduction';
import { EffectDamageResistance } from './damage-resistance';
import { EffectDamageVulnerability } from './damage-vulnerability';
import { EffectDamage } from './damage';
import { EffectDarkvision } from './darkvision';
import { EffectDisease } from './disease';
import { EffectExtraHitpoints } from './extra-hitpoints';
import { EffectFear } from './fear';
import { EffectHeal } from './heal';
import { EffectHealingFactor } from './healing-factor';
import { EffectHealingModifier } from './healing-modifier';
import { EffectInvisibility } from './invisibility';
import { EffectLight } from './light';
import { EffectParalysis } from './paralysis';
import { EffectPetrification } from './petrification';
import { EffectPoison } from './poison';
import { EffectRegenerationSchema } from './regeneration';
import { EffectSeeInvisibility } from './see-invisibility';
import { EffectSkillModifier } from './skill-modifier';
import { EffectSpeedFactor } from './speed-factor';
import { EffectStealth } from './stealth';
import { EffectStun } from './stun';

export const EffectSchema = z.discriminatedUnion('type', [
    EffectAbilityCheckModifier,
    EffectAbilityModifier,
    EffectAbilityResistanceModifier,
    EffectArmorClassModifier,
    EffectAttackModifier,
    EffectBlindness,
    EffectCharm,
    EffectDamageImmunity,
    EffectDamageModifier,
    EffectDamageReduction,
    EffectDamageResistance,
    EffectDamageVulnerability,
    EffectDamage,
    EffectDarkvision,
    EffectDisease,
    EffectExtraHitpoints,
    EffectFear,
    EffectHeal,
    EffectHealingFactor,
    EffectHealingModifier,
    EffectInvisibility,
    EffectLight,
    EffectParalysis,
    EffectPetrification,
    EffectPoison,
    EffectRegenerationSchema,
    EffectSeeInvisibility,
    EffectSkillModifier,
    EffectSpeedFactor,
    EffectStealth,
    EffectStun,
]);

export type Effect = z.infer<typeof EffectSchema>;
