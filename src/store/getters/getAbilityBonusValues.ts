import { State } from '../state';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';

/**
 * The abilities base values, without any bonus
 * @param state
 */
export const getAbilityBonusValues = (state: State): Record<Ability, number> => {
    return {
        [CONSTS.ABILITY_BODY]: 0,
        [CONSTS.ABILITY_SENSE]: 0,
        [CONSTS.ABILITY_MIND]: 0,
        [CONSTS.ABILITY_PRESENCE]: 0,
    };
};
