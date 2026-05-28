import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { Property } from '../../properties/schemas';
import { Item } from '../../schemas/Item';
import { GetterReturnType } from '../define-getters';

function addProperties(
    slot: EquipmentSlot,
    oRegistry: Record<EquipmentSlot, Property[]>,
    properties: Property[]
) {
    if (properties.length === 0) {
        return;
    }
    if (!(slot in oRegistry)) {
        oRegistry[slot] = [];
    }
    oRegistry[slot].push(...properties);
}

export function getEquipmentSlotProperties(
    state: State,
    getters: GetterReturnType
): Record<EquipmentSlot, Property[]> {
    const ds = getters.getDefensiveSlots;
    const os = getters.getOffensiveSlots;
    const aSlots: EquipmentSlot[] = [...ds, ...os];
    const oProperties = {} as Record<EquipmentSlot, Property[]>;
    const eq = state.equipment;
    aSlots.forEach((slot) => {
        const oItem: Item | null = eq[slot];
        if (oItem) {
            addProperties(
                slot,
                oProperties,
                oItem.properties
            );
        }
    });
    return oProperties;
}
