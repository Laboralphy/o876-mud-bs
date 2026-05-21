import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Specie } from '../../schemas/enums/Specie';

export const getSpecie = (
    state: State,
    getters: GetterReturnType
): Specie => {
    return state.specie;
};
