import { State } from '../state';
import { CONSTS } from '../../consts';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';

export const getCrossedAbilityModifiers = (
    state: State,
    getters: GetterReturnType
): Record<Ability, Record<Ability, number>> => {
    const mods = getters.getAbilityModifiers;
    const abilities = [
        CONSTS.ABILITY_BODY,
        CONSTS.ABILITY_SENSE,
        CONSTS.ABILITY_MIND,
        CONSTS.ABILITY_PRESENCE,
    ] as Ability[];
    return Object.fromEntries(
        abilities.map(a1 => [
            a1,
            Object.fromEntries(
                abilities.map(a2 => [a2, mods[a1] + Math.floor(mods[a2] / 2)])
            ),
        ])
    ) as Record<Ability, Record<Ability, number>>;
};
