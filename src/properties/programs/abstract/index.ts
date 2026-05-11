import { Property } from '../../schemas';
import { Creature } from '../../../Creature';
import { Item } from '../../../schemas/Item';
import { Attack } from '../../../Attack';
import { DamageType } from '../../../schemas/enums/DamageType';

export abstract class PropertyProgramAbstract<T extends Property> {
    mutate?(property: T, creature: Creature, item: Item): void;
    attack?(property: T, attack: Attack): void;
    attacked?(property: T, attack: Attack): void;
    damage?(
        property: T,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        target: Creature
    ): void;
    damaged?(
        property: T,
        amount: number,
        damageType: DamageType,
        creature: Creature,
        damager: Creature
    ): void;
}
