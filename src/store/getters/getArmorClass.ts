import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import BASE_ARMOR_CLASS from '../../data/creature-base-armor-class.json';
import { Ability } from '../../schemas/enums/Ability';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { AttackType } from '../../schemas/enums/AttackType';
import { Specie } from '../../schemas/enums/Specie';
import { DamageType } from '../../schemas/enums/DamageType';

export type ArmorClassStruct = {
    base: number;
    attackTypes: Partial<Record<AttackType, number>>;
    species: Partial<Record<Specie, number>>;
    damageTypes: Partial<Record<DamageType, number>>;
};

export function getArmorClass(state: State, getters: GetterReturnType): ArmorClassStruct {
    const acbv = BASE_ARMOR_CLASS[getters.getSize];
    const am: Record<Ability, number> = getters.getAbilityModifiers;
    const acNatural = state.armorClass;
    const equippedArmor = state.equipment[CONSTS.EQUIPMENT_SLOT_CHEST];
    const equippedShield = state.equipment[CONSTS.EQUIPMENT_SLOT_SHIELD];
    const maxSenseBonus = aggregate([CONSTS.PROPERTY_MAX_SENSE_BONUS], {}, getters).min;
    const acAbilities = acbv + Math.min(am[CONSTS.ABILITY_SENSES], maxSenseBonus) + Math.floor(am[CONSTS.ABILITY_BODY] / 2);
    const acArmor =
        equippedArmor && equippedArmor.itemType === CONSTS.ITEM_TYPE_ARMOR ? equippedArmor.armorClass : 0;
    const acShield =
        equippedShield && equippedShield.itemType === CONSTS.ITEM_TYPE_SHIELD ? equippedShield.armorClass : 0;
    const acAttackTypes: Partial<Record<AttackType, number>> = {};
    const acSpecies: Partial<Record<Specie, number>> = {};
    const acDamageTypes: Partial<Record<DamageType, number>> = {};
    aggregate(
        [CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER, CONSTS.EFFECT_ARMOR_CLASS_MODIFIER],
        {
            effects: {
                forEach: (effect) => {
                    if (effect.type === CONSTS.EFFECT_ARMOR_CLASS_MODIFIER) {
                        const amp = effect.data.amp;
                        if (effect.data.attackType) {
                            const k = effect.data.attackType;
                            acAttackTypes[k] = (acAttackTypes[k] ?? 0) + amp;
                        }
                        if (effect.data.specie) {
                            const k = effect.data.specie;
                            acSpecies[k] = (acSpecies[k] ?? 0) + amp;
                        }
                        if (effect.data.damageType) {
                            const k = effect.data.damageType;
                            acDamageTypes[k] = (acDamageTypes[k] ?? 0) + amp;
                        }
                    }
                },
            },
            properties: {
                forEach: (property) => {
                    if (property.type === CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER) {
                        const amp = property.data.amp;
                        if (property.data.attackType) {
                            const k = property.data.attackType;
                            acAttackTypes[k] = (acAttackTypes[k] ?? 0) + amp;
                        }
                        if (property.data.specie) {
                            const k = property.data.specie;
                            acSpecies[k] = (acSpecies[k] ?? 0) + amp;
                        }
                        if (property.data.damageType) {
                            const k = property.data.damageType;
                            acDamageTypes[k] = (acDamageTypes[k] ?? 0) + amp;
                        }
                    }
                },
            },
        },
        getters
    );
    return {
        base: acNatural + acAbilities + acArmor + acShield,
        attackTypes: acAttackTypes,
        species: acSpecies,
        damageTypes: acDamageTypes,
    };
}
