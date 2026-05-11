import { State } from '../state';
import { CONSTS } from '../../consts';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { GetterReturnType } from '../define-getters';

export function getOffensiveSlots(state: State, getters: GetterReturnType): EquipmentSlot[] {
    const sOffensiveSlot = state.selectedOffensiveSlot;
    const aSlots = [sOffensiveSlot];
    if (sOffensiveSlot === CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED && getters.isRangedWeaponLoaded) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_AMMO);
    }
    const eq = state.equipment;
    return aSlots.filter((slot) => eq[slot] !== null);
}
