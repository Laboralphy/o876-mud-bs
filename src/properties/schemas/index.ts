import z from 'zod';
import { CONSTS } from '../../consts';
import { BasePropertySchema } from '../../schemas/BaseProperty';
import { PropertyDamageImmunity } from './damage/damage-immunity';
import { PropertyDamageModifier } from './damage/damage-modifier';
import { PropertyDamageReduction } from './damage/damage-reduction';
import { PropertyDamageResistance } from './damage/damage-resistance';
import { PropertyDamageVulnerability } from './damage/damage-vulnerability';
import { PropertyHealingFactor } from './healing/healing-factor';
import { PropertyHealingModifier } from './healing/healing-modifier';
import { PropertyRegeneration } from './healing/regeneration';
import { PropertyCursed } from './items/cursed';
import { PropertyUnidentified } from './items/unidentified';
import { PropertyWeightFactor } from './items/weight-factor';
import { PropertyAbilityCheckModifier } from './modifiers/ability-check-modifier';
import { PropertyAbilityModifier } from './modifiers/ability-modifier';
import { PropertyAbilityResistanceModifier } from './modifiers/ability-resistance-modifier';
import { PropertyArmorClassModifier } from './modifiers/armor-class-modifier';
import { PropertyAttackModifier } from './modifiers/attack-modifier';
import { PropertyExtraHitpoints } from './modifiers/extra-hitpoints';
import { PropertyMaxSenseBonus } from './modifiers/max-sense-bonus';
import { PropertySkillModifier } from './modifiers/skill-modifier';
import { PropertyAilment } from './status/ailment';
import { PropertyImmunity } from './status/immunity';
import { PropertyThink } from './think/think';
import { PropertyDarkvision } from './visibility/darkvision';
import { PropertyLight } from './visibility/light';

export const PropertyDefinitionSchema = z.discriminatedUnion('type', [
    PropertyDamageImmunity,
    PropertyDamageModifier,
    PropertyDamageReduction,
    PropertyDamageResistance,
    PropertyDamageVulnerability,
    PropertyHealingFactor,
    PropertyHealingModifier,
    PropertyRegeneration,
    PropertyCursed,
    PropertyUnidentified,
    PropertyWeightFactor,
    PropertyAbilityCheckModifier,
    PropertyAbilityModifier,
    PropertyAbilityResistanceModifier,
    PropertyArmorClassModifier,
    PropertyAttackModifier,
    PropertyExtraHitpoints,
    PropertyMaxSenseBonus,
    PropertySkillModifier,
    PropertyAilment,
    PropertyImmunity,
    PropertyThink,
    PropertyDarkvision,
    PropertyLight,
]);

export type PropertyDefinition = z.infer<typeof PropertyDefinitionSchema>;

const _WrappedPropertyDamageImmunity = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DAMAGE_IMMUNITY), data: PropertyDamageImmunity });
const _WrappedPropertyDamageModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DAMAGE_MODIFIER), data: PropertyDamageModifier });
const _WrappedPropertyDamageReduction = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DAMAGE_REDUCTION), data: PropertyDamageReduction });
const _WrappedPropertyDamageResistance = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DAMAGE_RESISTANCE), data: PropertyDamageResistance });
const _WrappedPropertyDamageVulnerability = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DAMAGE_VULNERABILITY), data: PropertyDamageVulnerability });
const _WrappedPropertyHealingFactor = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_HEALING_FACTOR), data: PropertyHealingFactor });
const _WrappedPropertyHealingModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_HEALING_MODIFIER), data: PropertyHealingModifier });
const _WrappedPropertyRegeneration = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_REGENERATION), data: PropertyRegeneration });
const _WrappedPropertyCursed = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_CURSED), data: PropertyCursed });
const _WrappedPropertyUnidentified = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_UNIDENTIFIED), data: PropertyUnidentified });
const _WrappedPropertyWeightFactor = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_WEIGHT_FACTOR), data: PropertyWeightFactor });
const _WrappedPropertyAbilityCheckModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_ABILITY_CHECK_MODIFIER), data: PropertyAbilityCheckModifier });
const _WrappedPropertyAbilityModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_ABILITY_MODIFIER), data: PropertyAbilityModifier });
const _WrappedPropertyAbilityResistanceModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_ABILITY_RESISTANCE_MODIFIER), data: PropertyAbilityResistanceModifier });
const _WrappedPropertyArmorClassModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER), data: PropertyArmorClassModifier });
const _WrappedPropertyAttackModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_ATTACK_MODIFIER), data: PropertyAttackModifier });
const _WrappedPropertyExtraHitpoints = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_EXTRA_HITPOINTS), data: PropertyExtraHitpoints });
const _WrappedPropertyMaxSenseBonus = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_MAX_SENSE_BONUS), data: PropertyMaxSenseBonus });
const _WrappedPropertySkillModifier = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_SKILL_MODIFIER), data: PropertySkillModifier });
const _WrappedPropertyAilment = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_AILMENT), data: PropertyAilment });
const _WrappedPropertyImmunity = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_IMMUNITY), data: PropertyImmunity });
const _WrappedPropertyThink = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_THINK), data: PropertyThink });
const _WrappedPropertyDarkvision = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_DARKVISION), data: PropertyDarkvision });
const _WrappedPropertyLight = BasePropertySchema.extend({ type: z.literal(CONSTS.PROPERTY_LIGHT), data: PropertyLight });

export const PropertySchema = z.discriminatedUnion('type', [
    _WrappedPropertyDamageImmunity,
    _WrappedPropertyDamageModifier,
    _WrappedPropertyDamageReduction,
    _WrappedPropertyDamageResistance,
    _WrappedPropertyDamageVulnerability,
    _WrappedPropertyHealingFactor,
    _WrappedPropertyHealingModifier,
    _WrappedPropertyRegeneration,
    _WrappedPropertyCursed,
    _WrappedPropertyUnidentified,
    _WrappedPropertyWeightFactor,
    _WrappedPropertyAbilityCheckModifier,
    _WrappedPropertyAbilityModifier,
    _WrappedPropertyAbilityResistanceModifier,
    _WrappedPropertyArmorClassModifier,
    _WrappedPropertyAttackModifier,
    _WrappedPropertyExtraHitpoints,
    _WrappedPropertyMaxSenseBonus,
    _WrappedPropertySkillModifier,
    _WrappedPropertyAilment,
    _WrappedPropertyImmunity,
    _WrappedPropertyThink,
    _WrappedPropertyDarkvision,
    _WrappedPropertyLight,
]);

export type Property = z.infer<typeof PropertySchema>;
