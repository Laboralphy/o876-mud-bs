import z from 'zod';
import { CONSTS } from '../../consts';
import { BaseEffectSchema } from '../../schemas/BaseEffect';
import { EffectDamageImmunity } from './damage/damage-immunity';
import { EffectDamageReduction } from './damage/damage-reduction';
import { EffectDamageResistance } from './damage/damage-resistance';
import { EffectDamage } from './damage/damage';
import { EffectDamageVulnerability } from './damage/damage-vulnerability';
import { EffectHealingFactor } from './healing/healing-factor';
import { EffectHealingModifier } from './healing/healing-modifier';
import { EffectHeal } from './healing/heal';
import { EffectRegeneration } from './healing/regeneration';
import { EffectAbilityCheckModifier } from './modifiers/ability-check-modifier';
import { EffectAbilityModifier } from './modifiers/ability-modifier';
import { EffectAbilityResistanceModifier } from './modifiers/ability-resistance-modifier';
import { EffectArmorClassModifier } from './modifiers/armor-class-modifier';
import { EffectAttackModifier } from './modifiers/attack-modifier';
import { EffectExtraHitpoints } from './modifiers/extra-hitpoints';
import { EffectSkillModifier } from './modifiers/skill-modifier';
import { EffectSpeedFactor } from './modifiers/speed-factor';
import { EffectCharm } from './status/charm';
import { EffectDisease } from './status/disease';
import { EffectFear } from './status/fear';
import { EffectParalysis } from './status/paralysis';
import { EffectPetrification } from './status/petrification';
import { EffectPoison } from './status/poison';
import { EffectRoot } from './status/root';
import { EffectStun } from './status/stun';
import { EffectBlindness } from './visibility/blindness';
import { EffectDarkvision } from './visibility/darkvision';
import { EffectInvisibility } from './visibility/invisibility';
import { EffectLight } from './visibility/light';
import { EffectSeeInvisibility } from './visibility/see-invisibility';
import { EffectStealth } from './visibility/stealth';

export const EffectDefinitionSchema = z.discriminatedUnion('type', [
    EffectDamageImmunity,
    EffectDamageReduction,
    EffectDamageResistance,
    EffectDamage,
    EffectDamageVulnerability,
    EffectHealingFactor,
    EffectHealingModifier,
    EffectHeal,
    EffectRegeneration,
    EffectAbilityCheckModifier,
    EffectAbilityModifier,
    EffectAbilityResistanceModifier,
    EffectArmorClassModifier,
    EffectAttackModifier,
    EffectExtraHitpoints,
    EffectSkillModifier,
    EffectSpeedFactor,
    EffectCharm,
    EffectDisease,
    EffectFear,
    EffectParalysis,
    EffectPetrification,
    EffectPoison,
    EffectRoot,
    EffectStun,
    EffectBlindness,
    EffectDarkvision,
    EffectInvisibility,
    EffectLight,
    EffectSeeInvisibility,
    EffectStealth,
]);

export type EffectDefinition = z.infer<typeof EffectDefinitionSchema>;

const _WrappedEffectDamageImmunity = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DAMAGE_IMMUNITY), data: EffectDamageImmunity });
const _WrappedEffectDamageReduction = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DAMAGE_REDUCTION), data: EffectDamageReduction });
const _WrappedEffectDamageResistance = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DAMAGE_RESISTANCE), data: EffectDamageResistance });
const _WrappedEffectDamage = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DAMAGE), data: EffectDamage });
const _WrappedEffectDamageVulnerability = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DAMAGE_VULNERABILITY), data: EffectDamageVulnerability });
const _WrappedEffectHealingFactor = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_HEALING_FACTOR), data: EffectHealingFactor });
const _WrappedEffectHealingModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_HEALING_MODIFIER), data: EffectHealingModifier });
const _WrappedEffectHeal = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_HEAL), data: EffectHeal });
const _WrappedEffectRegeneration = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_REGENERATION), data: EffectRegeneration });
const _WrappedEffectAbilityCheckModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ABILITY_CHECK_MODIFIER), data: EffectAbilityCheckModifier });
const _WrappedEffectAbilityModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ABILITY_MODIFIER), data: EffectAbilityModifier });
const _WrappedEffectAbilityResistanceModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ABILITY_RESISTANCE_MODIFIER), data: EffectAbilityResistanceModifier });
const _WrappedEffectArmorClassModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ARMOR_CLASS_MODIFIER), data: EffectArmorClassModifier });
const _WrappedEffectAttackModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ATTACK_MODIFIER), data: EffectAttackModifier });
const _WrappedEffectExtraHitpoints = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_EXTRA_HITPOINTS), data: EffectExtraHitpoints });
const _WrappedEffectSkillModifier = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_SKILL_MODIFIER), data: EffectSkillModifier });
const _WrappedEffectSpeedFactor = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_SPEED_FACTOR), data: EffectSpeedFactor });
const _WrappedEffectCharm = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_CHARM), data: EffectCharm });
const _WrappedEffectDisease = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DISEASE), data: EffectDisease });
const _WrappedEffectFear = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_FEAR), data: EffectFear });
const _WrappedEffectParalysis = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_PARALYSIS), data: EffectParalysis });
const _WrappedEffectPetrification = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_PETRIFICATION), data: EffectPetrification });
const _WrappedEffectPoison = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_POISON), data: EffectPoison });
const _WrappedEffectRoot = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_ROOT), data: EffectRoot });
const _WrappedEffectStun = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_STUN), data: EffectStun });
const _WrappedEffectBlindness = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_BLINDNESS), data: EffectBlindness });
const _WrappedEffectDarkvision = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_DARKVISION), data: EffectDarkvision });
const _WrappedEffectInvisibility = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_INVISIBILITY), data: EffectInvisibility });
const _WrappedEffectLight = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_LIGHT), data: EffectLight });
const _WrappedEffectSeeInvisibility = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_SEE_INVISIBILITY), data: EffectSeeInvisibility });
const _WrappedEffectStealth = BaseEffectSchema.extend({ type: z.literal(CONSTS.EFFECT_STEALTH), data: EffectStealth });

export const EffectSchema = z.discriminatedUnion('type', [
    _WrappedEffectDamageImmunity,
    _WrappedEffectDamageReduction,
    _WrappedEffectDamageResistance,
    _WrappedEffectDamage,
    _WrappedEffectDamageVulnerability,
    _WrappedEffectHealingFactor,
    _WrappedEffectHealingModifier,
    _WrappedEffectHeal,
    _WrappedEffectRegeneration,
    _WrappedEffectAbilityCheckModifier,
    _WrappedEffectAbilityModifier,
    _WrappedEffectAbilityResistanceModifier,
    _WrappedEffectArmorClassModifier,
    _WrappedEffectAttackModifier,
    _WrappedEffectExtraHitpoints,
    _WrappedEffectSkillModifier,
    _WrappedEffectSpeedFactor,
    _WrappedEffectCharm,
    _WrappedEffectDisease,
    _WrappedEffectFear,
    _WrappedEffectParalysis,
    _WrappedEffectPetrification,
    _WrappedEffectPoison,
    _WrappedEffectRoot,
    _WrappedEffectStun,
    _WrappedEffectBlindness,
    _WrappedEffectDarkvision,
    _WrappedEffectInvisibility,
    _WrappedEffectLight,
    _WrappedEffectSeeInvisibility,
    _WrappedEffectStealth,
]);

export type Effect = z.infer<typeof EffectSchema>;
