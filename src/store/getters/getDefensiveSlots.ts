import { State } from '../state';
import { CONSTS } from '../../consts';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { GetterReturnType } from '../define-getters';

/**
 * Retrieves the list of defensive equipment slots that are currently occupied.
 * The method determines the applicable equipment slots based on the game's logic,
 * including whether a two-handed weapon is wielded.
 */
export function getDefensiveSlots(state: State, getters: GetterReturnType): EquipmentSlot[] {
    const aSlots: string[] = [
        CONSTS.EQUIPMENT_SLOT_HEAD,
        CONSTS.EQUIPMENT_SLOT_NECK,
        CONSTS.EQUIPMENT_SLOT_CHEST,
        CONSTS.EQUIPMENT_SLOT_BACK,
        CONSTS.EQUIPMENT_SLOT_ARMS,
        CONSTS.EQUIPMENT_SLOT_FINGER_LEFT,
        CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT,
        CONSTS.EQUIPMENT_SLOT_WAIST,
        CONSTS.EQUIPMENT_SLOT_FEET,
    ];
    if (!getters.isWieldingTwoHandedWeapon) {
        aSlots.push(CONSTS.EQUIPMENT_SLOT_SHIELD);
    }
    const eq = state.equipment;
    return aSlots.filter((slot) => eq[slot] !== null);
}
