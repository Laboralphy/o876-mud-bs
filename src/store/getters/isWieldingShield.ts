import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';

/**
 * Determines if the character is currently wielding a shield.
 * Note that, even if equipped, the shield might not be used at all times: if the character is attacking with a two-handed weapons,
 * the shield will not protect the character from damage.
 */
export function isWieldingShield(state: State, getters: GetterReturnType): boolean {
    return (
        state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD] != null &&
        !getters.getSelectedWeaponAttributeSet.has(CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED)
    );
}
