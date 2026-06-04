/**
 * Lists all effects that have any registered program (mutate or event hooks).
 */
import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { effectPrograms } from '../../effects/programs';
import { Effect } from '../../effects/schemas';

export const getEffectsWithProgram = (state: State, getters: GetterReturnType): Effect[] => {
    return getters.getEffects.filter((e) => effectPrograms.has(e.type));
};
