import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { PropertyType } from '../../schemas/enums/PropertyType';
import { Property } from '../../properties/schemas';

/**
 * Returns a set of property types
 * This will be useful to quickly check if a creature has a certain property
 */
export function getPropertySet(state: State, getters: GetterReturnType): Set<PropertyType> {
    const aProperties: Property[] = [...state.properties, ...getters.getEquipmentProperties];
    return aProperties.reduce(
        (prev: Set<PropertyType>, curr: Property) => prev.add(curr.type),
        new Set<PropertyType>()
    );
}
