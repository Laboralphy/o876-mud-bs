import { State } from '../state';
import { isWeapon } from '../type-guards';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Item } from '../../schemas/Item';

/**
 * Retrieves for the currently selected weapons.
 */
export function getSelectedWeapon(state: State, getters: GetterReturnType): Item | null {
    const w = state.equipment[state.selectedOffensiveSlot];
    if (w && isWeapon(w)) {
        if (w.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
            return getters.isRangedWeaponLoaded ? w : null;
        } else {
            return w;
        }
    } else {
        return null;
    }
}
