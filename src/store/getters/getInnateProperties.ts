import { State } from '../state';
import { Property } from '../../properties/schemas';

/**
 * Returns the innate properties of the creature
 * @returns Property[]
 */
export function getInnateProperties(state: State): Property[] {
    return state.properties.slice(0);
}
