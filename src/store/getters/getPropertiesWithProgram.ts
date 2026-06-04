/**
 * Lists all properties that have any registered program (mutate or event hooks).
 */
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { propertyPrograms } from '../../properties/programs';
import { Property } from '../../properties/schemas';

export const getPropertiesWithProgram = (state: State, getters: GetterReturnType): Property[] => {
    return getters.getInnateProperties
        .concat(getters.getEquipmentProperties)
        .filter((p) => propertyPrograms.has(p.type));
};
