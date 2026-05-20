import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';

function mod(stat: number): number {
    return Math.floor(stat / 2) - 5;
}

/**
 * The abilities modifier values
 * @param state
 * @param getters
 */
export const getAbilityModifiers = (
    state: State,
    getters: GetterReturnType
): Record<Ability, number> => {
    const abilities = getters.getAbilities;
    return {
        [CONSTS.ABILITY_BODY]: mod(abilities[CONSTS.ABILITY_BODY]),
        [CONSTS.ABILITY_SENSES]: mod(abilities[CONSTS.ABILITY_SENSES]),
        [CONSTS.ABILITY_MIND]: mod(abilities[CONSTS.ABILITY_MIND]),
        [CONSTS.ABILITY_PRESENCE]: mod(abilities[CONSTS.ABILITY_PRESENCE]),
    };
};
