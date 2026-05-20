import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { VARS } from '../../vars';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { AttackType } from '../../schemas/enums/AttackType';
import { Specie } from '../../schemas/enums/Specie';
import { DamageType } from '../../schemas/enums/DamageType';

export type ArmorClassStruct = {
    base: number;
    attackTypes: Map<AttackType, number>;
    species: Map<Specie, number>;
    damageTypes: Map<DamageType, number>;
};

function incRegistry<T extends AttackType | Specie | DamageType>(
    registry: Map<T, number>,
    key: T,
    value: number
) {
    const re = registry.get(key) ?? 0;
    registry.set(key, re + value);
}

export function getArmorClass(state: State, getters: GetterReturnType): ArmorClassStruct {
    const acbv = VARS.ARMOR_CLASS_BASE_VALUE;
    const am: Record<Ability, number> = getters.getAbilityModifiers;
    const acAbilities = acbv + am[CONSTS.ABILITY_SENSES] + Math.floor(am[CONSTS.ABILITY_BODY] / 2);
    const acNatural = state.armorClass;
    const acAttackTypes = new Map<AttackType, number>();
    const acSpecies = new Map<Specie, number>();
    const acDamageTypes = new Map<DamageType, number>();
    aggregate(
        [CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER, CONSTS.EFFECT_ARMOR_CLASS_MODIFIER],
        {
            effects: {
                forEach: (effect) => {
                    if (effect.type === CONSTS.EFFECT_ARMOR_CLASS_MODIFIER) {
                        const amp = effect.data.amp;
                        if (effect.data.attackType) {
                            incRegistry(acAttackTypes, effect.data.attackType, amp);
                        }
                        if (effect.data.specie) {
                            incRegistry(acSpecies, effect.data.specie, amp);
                        }
                        if (effect.data.damageType) {
                            incRegistry(acDamageTypes, effect.data.damageType, amp);
                        }
                    }
                },
            },
            properties: {
                forEach: (property) => {
                    if (property.type === CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER) {
                        const amp = property.data.amp;
                        if (property.data.attackType) {
                            incRegistry(acAttackTypes, property.data.attackType, amp);
                        }
                        if (property.data.specie) {
                            incRegistry(acSpecies, property.data.specie, amp);
                        }
                        if (property.data.damageType) {
                            incRegistry(acDamageTypes, property.data.damageType, amp);
                        }
                    }
                },
            },
        },
        getters
    );
    return {
        base: acNatural + acAbilities,
        attackTypes: acAttackTypes,
        species: acSpecies,
        damageTypes: acDamageTypes,
    };
}
