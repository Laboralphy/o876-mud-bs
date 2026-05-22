import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Ability, AbilitySchema } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { Effect } from '../../effects/schemas';
import { Property } from '../../properties/schemas';

export const getResistanceValues = (
    state: State,
    getters: GetterReturnType
): Record<Ability, number> => {
    const modifiers = getters.getAbilityModifiers;
    const result = aggregate(
        [CONSTS.PROPERTY_ABILITY_RESISTANCE_MODIFIER, CONSTS.EFFECT_ABILITY_RESISTANCE_MODIFIER],
        {
            effects: {
                discriminator: (pe: Effect) =>
                    pe.type === CONSTS.EFFECT_ABILITY_RESISTANCE_MODIFIER ? pe.data.ability : '',
            },
            properties: {
                discriminator: (pe: Property) =>
                    pe.type === CONSTS.PROPERTY_ABILITY_RESISTANCE_MODIFIER
                        ? pe.data.ability
                        : '',
            },
        },
        getters
    );
    return Object.fromEntries(
        AbilitySchema.options.map((ability: Ability) => [
            ability,
            modifiers[ability] + (result.discriminator[ability]?.sum ?? 0),
        ])
    ) as Record<Ability, number>;
};
