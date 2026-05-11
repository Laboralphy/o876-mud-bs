import { State } from '../state';
import { CONSTS } from '../../consts';
import { isAmmo, isWeapon } from '../type-guards';

/**
 * Determines if the ranged weapon equipped is loaded with the correct type of ammunition.
 * It is not necessary for the weapon to be selected as primary. This getter should return true
 * even if the character is attacking with a dagger but also equipped with bow and arrows.
 *
 * @param {State} state - The current state of the game, including equipped items and their attributes.
 * @return {boolean} Returns true if a ranged weapon is equipped, requires ammunition, and the correct ammunition is loaded; otherwise, returns false.
 */
export function isRangedWeaponLoaded(state: State): boolean {
    const weapon = state.equipment[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED];
    if (isWeapon(weapon)) {
        const wa = weapon.attributes;
        if (wa.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
            const sAmmoType = weapon.ammoType;
            const oAmmo = state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO];
            return isAmmo(oAmmo) && oAmmo.ammoType === sAmmoType;
        }
    }
    return false;
}
