import { State } from '../state';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { Property } from '../../properties/schemas';
import { Item } from '../../schemas/Item';
import { GetterReturnType } from '../define-getters';
import { TemporaryProperty } from '../../schemas/TemporaryProperty';

/**
 * Adds all specified properties to the registry at "slot" index
 * @param slot equipment slot index
 * @param oRegistry final registry
 * @param properties list of item properties
 */
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

/**
 * Retrieves the properties associated with equipment slots
 */
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
            // Static properties
            addProperties(slot, oProperties, oItem.properties);
            // Temporary properties
            addProperties(
                slot,
                oProperties,
                oItem.temporaryProperties
                    .filter(
                        (tp: object): tp is TemporaryProperty =>
                            'duration' in tp && typeof tp.duration === 'number' && tp.duration > 0
                    )
                    .map((tp: TemporaryProperty): Property => tp.property)
            );
        }
    });
    return oProperties;
}
