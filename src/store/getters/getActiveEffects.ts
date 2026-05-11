/**
 * Lists all effects associated with a registered effect program.
 */
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { effectPrograms } from '../../effects/programs';
import { Effect } from '../../effects/schemas';

export const getActiveEffects = (state: State, getters: GetterReturnType): Effect[] => {
    return getters.getEffects.filter((e) => effectPrograms.has(e.type));
};
