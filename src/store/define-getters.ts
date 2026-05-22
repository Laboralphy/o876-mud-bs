import { GetterOutput } from '@laboralphy/reactor';
import { getAbilities } from './getters/getAbilities';
import { getAbilityBaseValues } from './getters/getAbilityBaseValues';
import { getAbilityBonusValues } from './getters/getAbilityBonusValues';
import { getAbilityModifiers } from './getters/getAbilityModifiers';
import { getActiveEffects } from './getters/getActiveEffects';
import { getActiveProperties } from './getters/getActiveProperties';
import { getArmorClass } from './getters/getArmorClass';
import { getAttackBonus } from './getters/getAttackBonus';
import { getDamageMitigation } from './getters/getDamageMitigation';
import { getHealingFactor } from './getters/getHealingFactor';
import { getDefensiveSlots } from './getters/getDefensiveSlots';
import { getEffectSet } from './getters/getEffectSet';
import { getEffects } from './getters/getEffects';
import { getEquipmentProperties } from './getters/getEquipmentProperties';
import { getEquipmentSlotProperties } from './getters/getEquipmentSlotProperties';
import { getInnateProperties } from './getters/getInnateProperties';
import { getMaxHitPoints } from './getters/getMaxHitPoints';
import { getOffensiveSlots } from './getters/getOffensiveSlots';
import { getPropertySet } from './getters/getPropertySet';
import { getResistanceValues } from './getters/getResistanceValues';
import { getSelectedWeaponAmmo } from './getters/getSelectedWeaponAmmo';
import { getSelectedWeaponAttributeSet } from './getters/getSelectedWeaponAttributeSet';
import { getSelectedWeapon } from './getters/getSelectedWeapon';
import { getSkillBonusValues } from './getters/getSkillBonusValues';
import { getSkillValues } from './getters/getSkillValues';
import { getSpecie } from './getters/getSpecie';
import { getThreatResistanceBonus } from './getters/getThreatResistanceBonus';
import { isRangedWeaponLoaded } from './getters/isRangedWeaponLoaded';
import { isWieldingShield } from './getters/isWieldingShield';
import { isWieldingTwoHandedWeapon } from './getters/isWieldingTwoHandedWeapon';
export type GetterReturnFunctions = {
    getAbilities: typeof getAbilities;
    getAbilityBaseValues: typeof getAbilityBaseValues;
    getAbilityBonusValues: typeof getAbilityBonusValues;
    getAbilityModifiers: typeof getAbilityModifiers;
    getActiveEffects: typeof getActiveEffects;
    getActiveProperties: typeof getActiveProperties;
    getArmorClass: typeof getArmorClass;
    getAttackBonus: typeof getAttackBonus;
    getDamageMitigation: typeof getDamageMitigation;
    getHealingFactor: typeof getHealingFactor;
    getDefensiveSlots: typeof getDefensiveSlots;
    getEffectSet: typeof getEffectSet;
    getEffects: typeof getEffects;
    getEquipmentProperties: typeof getEquipmentProperties;
    getEquipmentSlotProperties: typeof getEquipmentSlotProperties;
    getInnateProperties: typeof getInnateProperties;
    getMaxHitPoints: typeof getMaxHitPoints;
    getOffensiveSlots: typeof getOffensiveSlots;
    getPropertySet: typeof getPropertySet;
    getResistanceValues: typeof getResistanceValues;
    getSelectedWeaponAmmo: typeof getSelectedWeaponAmmo;
    getSelectedWeaponAttributeSet: typeof getSelectedWeaponAttributeSet;
    getSelectedWeapon: typeof getSelectedWeapon;
    getSkillBonusValues: typeof getSkillBonusValues;
    getSkillValues: typeof getSkillValues;
    getSpecie: typeof getSpecie;
    getThreatResistanceBonus: typeof getThreatResistanceBonus;
    isRangedWeaponLoaded: typeof isRangedWeaponLoaded;
    isWieldingShield: typeof isWieldingShield;
    isWieldingTwoHandedWeapon: typeof isWieldingTwoHandedWeapon;
};

export type GetterReturnType = GetterOutput<GetterReturnFunctions>;
export const Getters = {
    getAbilities,
    getAbilityBaseValues,
    getAbilityBonusValues,
    getAbilityModifiers,
    getActiveEffects,
    getActiveProperties,
    getArmorClass,
    getAttackBonus,
    getDamageMitigation,
    getHealingFactor,
    getDefensiveSlots,
    getEffectSet,
    getEffects,
    getEquipmentProperties,
    getEquipmentSlotProperties,
    getInnateProperties,
    getMaxHitPoints,
    getOffensiveSlots,
    getPropertySet,
    getResistanceValues,
    getSelectedWeaponAmmo,
    getSelectedWeaponAttributeSet,
    getSelectedWeapon,
    getSkillBonusValues,
    getSkillValues,
    getSpecie,
    getThreatResistanceBonus,
    isRangedWeaponLoaded,
    isWieldingShield,
    isWieldingTwoHandedWeapon,
};
