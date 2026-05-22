import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { AttackType } from '../../schemas/enums/AttackType';
import { Specie } from '../../schemas/enums/Specie';

export type AttackBonusStruct = {
    base: number;
    attackTypes: Partial<Record<AttackType, number>>;
    species: Partial<Record<Specie, number>>;
};

export function getAttackBonus(state: State, getters: GetterReturnType): AttackBonusStruct {
    const am: Record<Ability, number> = getters.getAbilityModifiers;
    let base = 0;
    const attackTypes: Partial<Record<AttackType, number>> = {
        [CONSTS.ATTACK_TYPE_MELEE]: am[CONSTS.ABILITY_BODY],
        [CONSTS.ATTACK_TYPE_RANGED]: am[CONSTS.ABILITY_SENSES],
    };
    const species: Partial<Record<Specie, number>> = {};
    aggregate(
        [CONSTS.PROPERTY_ATTACK_MODIFIER, CONSTS.EFFECT_ATTACK_MODIFIER],
        {
            effects: {
                forEach: (effect) => {
                    if (effect.type === CONSTS.EFFECT_ATTACK_MODIFIER) {
                        const amp = effect.data.amp;
                        if (effect.data.attackType) {
                            const k = effect.data.attackType;
                            attackTypes[k] = (attackTypes[k] ?? 0) + amp;
                        } else if (effect.data.specie) {
                            const k = effect.data.specie;
                            species[k] = (species[k] ?? 0) + amp;
                        } else {
                            base += amp;
                        }
                    }
                },
            },
            properties: {
                forEach: (property) => {
                    if (property.type === CONSTS.PROPERTY_ATTACK_MODIFIER) {
                        const amp = property.data.amp;
                        if (property.data.attackType) {
                            const k = property.data.attackType;
                            attackTypes[k] = (attackTypes[k] ?? 0) + amp;
                        } else if (property.data.specie) {
                            const k = property.data.specie;
                            species[k] = (species[k] ?? 0) + amp;
                        } else {
                            base += amp;
                        }
                    }
                },
            },
        },
        getters
    );
    return { base, attackTypes, species };
}
