import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';

/**
 * Determines if the character is currently using a two-handed weapons.
 * This function requires that a weapons is selected.
 * If the character is equipping a dagger and a bow and currently attacking with dagger, this getter
 * should return false. If the character switches to bow for a ranged attack, the getter should return true.
 *
 */
export function isWieldingTwoHandedWeapon(state: State, getters: GetterReturnType): boolean {
    const wa = getters.getSelectedWeaponAttributeSet;
    return (
        wa.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED) ||
        (wa.has(CONSTS.WEAPON_ATTRIBUTE_VERSATILE) && !getters.isWieldingShield)
    );
}
