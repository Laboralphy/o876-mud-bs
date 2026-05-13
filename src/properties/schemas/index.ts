import z from 'zod';
import { PropertyAbilityCheckModifier } from './ability-check-modifier';
import { PropertySchemaAbilityModifier } from './ability-modifier';
import { PropertyAbilityResistanceModifier } from './ability-resistance-modifier';
import { PropertyArmorClassModifier } from './armor-class-modifier';
import { PropertyAttackModifier } from './attack-modifier';
import { PropertyCursed } from './cursed';
import { PropertyDamageImmunity } from './damage-immunity';
import { PropertyDamageModifier } from './damage-modifier';
import { PropertyDamageReduction } from './damage-reduction';
import { PropertyDamageResistance } from './damage-resistance';
import { PropertyDamageVulnerability } from './damage-vulnerability';
import { PropertyDarkvision } from './darkvision';
import { PropertyExtraHitpoints } from './extra-hitpoints';
import { PropertyExtraWeaponDamageType } from './extra-weapon-damage-type';
import { PropertyHealingFactor } from './healing-factor';
import { PropertyHealingModifier } from './healing-modifier';
import { PropertyLight } from './light';
import { PropertySchemaRegeneration } from './regeneration';
import { PropertyUnidentified } from './unidentified';
import { PropertyWeightFactor } from './weight-factor';

export const PropertySchema = z.discriminatedUnion('type', [
    PropertyAbilityCheckModifier,
    PropertySchemaAbilityModifier,
    PropertyAbilityResistanceModifier,
    PropertyArmorClassModifier,
    PropertyAttackModifier,
    PropertyCursed,
    PropertyDamageImmunity,
    PropertyDamageModifier,
    PropertyDamageReduction,
    PropertyDamageResistance,
    PropertyDamageVulnerability,
    PropertyDarkvision,
    PropertyExtraHitpoints,
    PropertyExtraWeaponDamageType,
    PropertyHealingFactor,
    PropertyHealingModifier,
    PropertyLight,
    PropertySchemaRegeneration,
    PropertyUnidentified,
    PropertyWeightFactor,
]);

export type Property = z.infer<typeof PropertySchema>;
