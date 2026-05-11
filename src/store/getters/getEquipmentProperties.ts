import { State } from '../state';
import { Property } from '../../properties/schemas';
import { GetterReturnType } from '../define-getters';

export function getEquipmentProperties(state: State, getters: GetterReturnType): Property[] {
    return Object.values(getters.getEquipmentSlotProperties).flat();
}
