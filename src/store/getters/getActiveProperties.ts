/**
 * This getter will list all active properties : that means properties that are associated with a
 * property program with mutate method.
 */
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { propertyPrograms } from '../../properties/programs';
import { Property } from '../../properties/schemas';

export const getActiveProperties = (state: State, getters: GetterReturnType): Property[] => {
    return getters.getInnateProperties
        .concat(getters.getEquipmentProperties)
        .filter((p) => propertyPrograms.has(p.type) && propertyPrograms.get(p.type)!.mutate);
};
