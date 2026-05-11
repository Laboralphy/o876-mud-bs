import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { VARS } from '../../vars';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';

export function getArmorClass(state: State, getters: GetterReturnType): number {
    const acbv = VARS.ARMOR_CLASS_BASE_VALUE;
    const am: Record<Ability, number> = getters.getAbilityModifiers;
    return acbv + am[CONSTS.ABILITY_SENSE] + Math.floor(am[CONSTS.ABILITY_SENSE] / 2);
}
