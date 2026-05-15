import { GetterOutput } from '@laboralphy/reactor';
import { getAbilities } from './getters/getAbilities';
import { getAbilityBaseValues } from './getters/getAbilityBaseValues';
import { getAbilityBonusValues } from './getters/getAbilityBonusValues';
import { getAbilityModifiers } from './getters/getAbilityModifiers';
import { getActiveEffects } from './getters/getActiveEffects';
import { getActiveProperties } from './getters/getActiveProperties';
import { getArmorClass } from './getters/getArmorClass';
import { getCrossedAbilityModifiers } from './getters/getCrossedAbilityModifiers';
import { getDefensiveSlots } from './getters/getDefensiveSlots';
import { getEffectSet } from './getters/getEffectSet';
import { getEffects } from './getters/getEffects';
import { getEquipmentProperties } from './getters/getEquipmentProperties';
import { getEquipmentSlotProperties } from './getters/getEquipmentSlotProperties';
import { getInnateProperties } from './getters/getInnateProperties';
import { getMaxHitPoints } from './getters/getMaxHitPoints';
import { getOffensiveSlots } from './getters/getOffensiveSlots';
import { getPropertySet } from './getters/getPropertySet';
import { getSelectedWeaponAttributeSet } from './getters/getSelectedWeaponAttributeSet';
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
    getCrossedAbilityModifiers: typeof getCrossedAbilityModifiers;
    getDefensiveSlots: typeof getDefensiveSlots;
    getEffectSet: typeof getEffectSet;
    getEffects: typeof getEffects;
    getEquipmentProperties: typeof getEquipmentProperties;
    getEquipmentSlotProperties: typeof getEquipmentSlotProperties;
    getInnateProperties: typeof getInnateProperties;
    getMaxHitPoints: typeof getMaxHitPoints;
    getOffensiveSlots: typeof getOffensiveSlots;
    getPropertySet: typeof getPropertySet;
    getSelectedWeaponAttributeSet: typeof getSelectedWeaponAttributeSet;
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
    getCrossedAbilityModifiers,
    getDefensiveSlots,
    getEffectSet,
    getEffects,
    getEquipmentProperties,
    getEquipmentSlotProperties,
    getInnateProperties,
    getMaxHitPoints,
    getOffensiveSlots,
    getPropertySet,
    getSelectedWeaponAttributeSet,
    isRangedWeaponLoaded,
    isWieldingShield,
    isWieldingTwoHandedWeapon,
};
