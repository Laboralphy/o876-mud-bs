import { Creature } from '../Creature';
import { Attack } from '../Attack';
import { DamageType } from '../schemas/enums/DamageType';

export interface IProgram<T> {
    /**
     * This method is run each turn
     * Applies on properties and effects
     * @param propOrEffect the property or effect.
     * @param creature creture holding this property of effect
     * @param source the creature that caused the effect to be applied
     */
    mutate?(propOrEffect: T, creature: Creature, source: Creature | undefined): void;

    /**
     * This method is invoked when the creature attacks its target.
     * Applies on both properties and effects
     * @param propOrEffect
     * @param attack
     */
    attack?(propOrEffect: T, attack: Attack): void;

    /**
     * This method is invoked when the creature is attacked by another creature.
     * Applies on both properties and effects
     * @param propOrEffect
     * @param attack
     */
    attacked?(propOrEffect: T, attack: Attack): void;

    /**
     * This method is invoked when the creature is damaged by another creature.
     * Applies on both properties and effects
     * @param propOrEffect
     * @param amount
     * @param damageType
     * @param creature
     * @param target
     */
    damage?(
        propOrEffect: T,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        target: Creature
    ): void;

    /**
     * This method is invoked when the creature is inflicting damage to its target
     * Applies on both properties and effects
     * @param propOrEffect
     * @param amount
     * @param damageType
     * @param creature
     * @param source
     */
    damaged?(
        propOrEffect: T,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        source: Creature | undefined
    ): void;

    /**
     * This method is invoked when a new effect is applied to a creature.
     * This method applies only to effects, not properties.
     * @param propOrEffect
     * @param creature
     * @param source
     */
    apply?(propOrEffect: T, creature: Creature, source: Creature): void;

    /**
     * This method is invoked when an effect is removed from a creature.
     * This method applies only to effects, not properties.
     * @param propOrEffect
     * @param creature
     * @param source
     */
    dispose?(propOrEffect: T, creature: Creature, source: Creature | undefined): void;
}
