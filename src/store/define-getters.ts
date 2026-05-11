import { GetterOutput } from '@laboralphy/reactor';
import { getAbilities } from './getters/getAbilities';
import { getAbilityBaseValues } from './getters/getAbilityBaseValues';
import { getAbilityBonusValues } from './getters/getAbilityBonusValues';
import { getAbilityModifiers } from './getters/getAbilityModifiers';
import { getArmorClass } from './getters/getArmorClass';
import { getDefensiveSlots } from './getters/getDefensiveSlots';
import { getEquipmentSlotProperties } from './getters/getEquipmentSlotProperties';
import { getInnateProperties } from './getters/getInnateProperties';
import { getMaxHitPoints } from './getters/getMaxHitPoints';
import { getOffensiveSlots } from './getters/getOffensiveSlots';
import { getSelectedWeaponAttributeSet } from './getters/getSelectedWeaponAttributeSet';
import { isWieldingShield } from './getters/isWieldingShield';
import { isWieldingTwoHandedWeapon } from './getters/isWieldingTwoHandedWeapon';
export type GetterReturnFunctions = {
    getAbilities: typeof getAbilities;
    getAbilityBaseValues: typeof getAbilityBaseValues;
    getAbilityBonusValues: typeof getAbilityBonusValues;
    getAbilityModifiers: typeof getAbilityModifiers;
    getArmorClass: typeof getArmorClass;
    getDefensiveSlots: typeof getDefensiveSlots;
    getEquipmentSlotProperties: typeof getEquipmentSlotProperties;
    getInnateProperties: typeof getInnateProperties;
    getMaxHitPoints: typeof getMaxHitPoints;
    getOffensiveSlots: typeof getOffensiveSlots;
    getSelectedWeaponAttributeSet: typeof getSelectedWeaponAttributeSet;
    isWieldingShield: typeof isWieldingShield;
    isWieldingTwoHandedWeapon: typeof isWieldingTwoHandedWeapon;
};

export type GetterReturnType = GetterOutput<GetterReturnFunctions>;
export const Getters = {
    getAbilities,
    getAbilityBaseValues,
    getAbilityBonusValues,
    getAbilityModifiers,
    getArmorClass,
    getDefensiveSlots,
    getEquipmentSlotProperties,
    getInnateProperties,
    getMaxHitPoints,
    getOffensiveSlots,
    getSelectedWeaponAttributeSet,
    isWieldingShield,
    isWieldingTwoHandedWeapon,
};
