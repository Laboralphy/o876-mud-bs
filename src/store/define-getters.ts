import { GetterOutput } from '@laboralphy/reactor';
import { canAct } from './getters/canAct';
import { canFight } from './getters/canFight';
import { canMove } from './getters/canMove';
import { getAbilities } from './getters/getAbilities';
import { getAbilityBaseValues } from './getters/getAbilityBaseValues';
import { getAbilityBonusValues } from './getters/getAbilityBonusValues';
import { getAbilityModifiers } from './getters/getAbilityModifiers';
import { getActions } from './getters/getActions';
import { getActiveEffects } from './getters/getActiveEffects';
import { getActiveProperties } from './getters/getActiveProperties';
import { getArmorClass } from './getters/getArmorClass';
import { getAttackBonus } from './getters/getAttackBonus';
import { getCharmerSet } from './getters/getCharmerSet';
import { getDamageMitigation } from './getters/getDamageMitigation';
import { getDefensiveSlots } from './getters/getDefensiveSlots';
import { getEffectSet } from './getters/getEffectSet';
import { getEffects } from './getters/getEffects';
import { getEquipmentProperties } from './getters/getEquipmentProperties';
import { getEquipmentSlotProperties } from './getters/getEquipmentSlotProperties';
import { getHealingFactor } from './getters/getHealingFactor';
import { getImmunities } from './getters/getImmunities';
import { getInnateProperties } from './getters/getInnateProperties';
import { getMaxHitPoints } from './getters/getMaxHitPoints';
import { getOffensiveSlots } from './getters/getOffensiveSlots';
import { getPropertySet } from './getters/getPropertySet';
import { getResistanceValues } from './getters/getResistanceValues';
import { getSelectedWeapon } from './getters/getSelectedWeapon';
import { getSelectedWeaponAmmo } from './getters/getSelectedWeaponAmmo';
import { getSelectedWeaponAttributeSet } from './getters/getSelectedWeaponAttributeSet';
import { getSize } from './getters/getSize';
import { getSkillBonusValues } from './getters/getSkillBonusValues';
import { getSkillValues } from './getters/getSkillValues';
import { getSpecie } from './getters/getSpecie';
import { isRangedWeaponLoaded } from './getters/isRangedWeaponLoaded';
import { isWieldingShield } from './getters/isWieldingShield';
import { isWieldingTwoHandedWeapon } from './getters/isWieldingTwoHandedWeapon';
export type GetterReturnFunctions = {
    canAct: typeof canAct;
    canFight: typeof canFight;
    canMove: typeof canMove;
    getAbilities: typeof getAbilities;
    getAbilityBaseValues: typeof getAbilityBaseValues;
    getAbilityBonusValues: typeof getAbilityBonusValues;
    getAbilityModifiers: typeof getAbilityModifiers;
    getActions: typeof getActions;
    getActiveEffects: typeof getActiveEffects;
    getActiveProperties: typeof getActiveProperties;
    getArmorClass: typeof getArmorClass;
    getAttackBonus: typeof getAttackBonus;
    getCharmerSet: typeof getCharmerSet;
    getDamageMitigation: typeof getDamageMitigation;
    getDefensiveSlots: typeof getDefensiveSlots;
    getEffectSet: typeof getEffectSet;
    getEffects: typeof getEffects;
    getEquipmentProperties: typeof getEquipmentProperties;
    getEquipmentSlotProperties: typeof getEquipmentSlotProperties;
    getHealingFactor: typeof getHealingFactor;
    getImmunities: typeof getImmunities;
    getInnateProperties: typeof getInnateProperties;
    getMaxHitPoints: typeof getMaxHitPoints;
    getOffensiveSlots: typeof getOffensiveSlots;
    getPropertySet: typeof getPropertySet;
    getResistanceValues: typeof getResistanceValues;
    getSelectedWeapon: typeof getSelectedWeapon;
    getSelectedWeaponAmmo: typeof getSelectedWeaponAmmo;
    getSelectedWeaponAttributeSet: typeof getSelectedWeaponAttributeSet;
    getSize: typeof getSize;
    getSkillBonusValues: typeof getSkillBonusValues;
    getSkillValues: typeof getSkillValues;
    getSpecie: typeof getSpecie;
    isRangedWeaponLoaded: typeof isRangedWeaponLoaded;
    isWieldingShield: typeof isWieldingShield;
    isWieldingTwoHandedWeapon: typeof isWieldingTwoHandedWeapon;
};

export type GetterReturnType = GetterOutput<GetterReturnFunctions>;
export const Getters = {
    canAct,
    canFight,
    canMove,
    getAbilities,
    getAbilityBaseValues,
    getAbilityBonusValues,
    getAbilityModifiers,
    getActions,
    getActiveEffects,
    getActiveProperties,
    getArmorClass,
    getAttackBonus,
    getCharmerSet,
    getDamageMitigation,
    getDefensiveSlots,
    getEffectSet,
    getEffects,
    getEquipmentProperties,
    getEquipmentSlotProperties,
    getHealingFactor,
    getImmunities,
    getInnateProperties,
    getMaxHitPoints,
    getOffensiveSlots,
    getPropertySet,
    getResistanceValues,
    getSelectedWeapon,
    getSelectedWeaponAmmo,
    getSelectedWeaponAttributeSet,
    getSize,
    getSkillBonusValues,
    getSkillValues,
    getSpecie,
    isRangedWeaponLoaded,
    isWieldingShield,
    isWieldingTwoHandedWeapon,
};
