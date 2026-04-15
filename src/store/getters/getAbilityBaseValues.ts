import { State } from '../state';
import { CONSTS } from '../../consts';

export const getAbilityBaseValues = (state: State) => {
    return {
        body: state.abilities[CONSTS.ABILITY_BODY],
        sense: state.abilities[CONSTS.ABILITY_SENSE],
        mind: state.abilities[CONSTS.ABILITY_MIND],
        presence: state.abilities[CONSTS.ABILITY_PRESENCE],
    };
};
