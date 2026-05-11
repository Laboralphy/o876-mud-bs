import { State } from '../state';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';

/**
 * The ability bonus (for each ability) is computed by adding properties and effects.
 */
export const getAbilityBonusValues = (state: State): Record<Ability, number> => {
    return {
        [CONSTS.ABILITY_BODY]: 0,
        [CONSTS.ABILITY_SENSE]: 0,
        [CONSTS.ABILITY_MIND]: 0,
        [CONSTS.ABILITY_PRESENCE]: 0,
    };
};
