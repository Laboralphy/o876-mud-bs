import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CreatureSize } from '../../schemas/enums/CreatureSize';

export const getSize = (state: State, getters: GetterReturnType): CreatureSize => {
    return state.size;
};
