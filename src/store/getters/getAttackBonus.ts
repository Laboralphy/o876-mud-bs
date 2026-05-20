import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { AttackType } from '../../schemas/enums/AttackType';
import { Specie } from '../../schemas/enums/Specie';

export type AttackBonusStruct = {
    base: number;
    attackTypes: Map<AttackType, number>;
    species: Map<Specie, number>;
};

function incRegistry<T extends AttackType | Specie>(
    registry: Map<T, number>,
    key: T,
    value: number
) {
    registry.set(key, (registry.get(key) ?? 0) + value);
}

export function getAttackBonus(state: State, getters: GetterReturnType): AttackBonusStruct {
    const am: Record<Ability, number> = getters.getAbilityModifiers;
    let base = 0;
    const attackTypes = new Map<AttackType, number>([
        [CONSTS.ATTACK_TYPE_MELEE, am[CONSTS.ABILITY_BODY]],
        [CONSTS.ATTACK_TYPE_RANGED, am[CONSTS.ABILITY_SENSES]],
    ]);
    const species = new Map<Specie, number>();
    aggregate(
        [CONSTS.PROPERTY_ATTACK_MODIFIER, CONSTS.EFFECT_ATTACK_MODIFIER],
        {
            effects: {
                forEach: (effect) => {
                    if (effect.type === CONSTS.EFFECT_ATTACK_MODIFIER) {
                        const amp = effect.data.amp;
                        if (effect.data.attackType) {
                            incRegistry(attackTypes, effect.data.attackType, amp);
                        } else if (effect.data.specie) {
                            incRegistry(species, effect.data.specie, amp);
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
                            incRegistry(attackTypes, property.data.attackType, amp);
                        } else if (property.data.specie) {
                            incRegistry(species, property.data.specie, amp);
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
