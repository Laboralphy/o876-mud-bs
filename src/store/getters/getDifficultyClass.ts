import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { VARS } from '../../vars';

export const getDifficultyClass = (
    state: State,
    getters: GetterReturnType
): Record<Ability, number> => {
    const modifiers = getters.getAbilityModifiers;
    return {
        [CONSTS.ABILITY_BODY]: VARS.BASE_DIFFICULTY_CLASS + modifiers[CONSTS.ABILITY_BODY],
        [CONSTS.ABILITY_SENSES]: VARS.BASE_DIFFICULTY_CLASS + modifiers[CONSTS.ABILITY_SENSES],
        [CONSTS.ABILITY_MIND]: VARS.BASE_DIFFICULTY_CLASS + modifiers[CONSTS.ABILITY_MIND],
        [CONSTS.ABILITY_PRESENCE]: VARS.BASE_DIFFICULTY_CLASS + modifiers[CONSTS.ABILITY_PRESENCE],
    };
};
