import { State } from '../state';
import { WeaponAttribute } from '../../schemas/enums/WeaponAttribute';
import { isWeapon } from '../type-guards';

/**
 * Retrieves the set of attributes for the currently selected weapons.
 *
 * @param state The current state containing equipment and selected offensive slot information.
 * @return A set of weapons attributes for the selected weapons, or an empty set if no weapons is selected or the selection is invalid.
 */
export function getSelectedWeaponAttributeSet(state: State): Set<WeaponAttribute> {
    const w = state.equipment[state.selectedOffensiveSlot];
    if (w && isWeapon(w)) {
        return new Set<WeaponAttribute>(w.attributes);
    }
    return new Set<WeaponAttribute>();
}
