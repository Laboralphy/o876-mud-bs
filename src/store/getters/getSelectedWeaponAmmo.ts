import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Item } from '../../schemas/Item';

/**
 * Retrieves for the currently selected weapons ammo, if weapons is ranged and properly loaded, else return null.
 */
export function getSelectedWeaponAmmo(state: State, getters: GetterReturnType): Item | null {
    if (getters.isRangedWeaponLoaded) {
        return state.equipment[CONSTS.EQUIPMENT_SLOT_AMMO];
    } else {
        return null;
    }
}
