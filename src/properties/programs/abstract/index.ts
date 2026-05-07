import { Property } from '../../../schemas/Property';
import { Creature } from '../../../Creature';
import { Item } from '../../../schemas/Item';
import { Attack } from '../../../Attack';

export abstract class PropertyProgramAbstract<T extends Property> {
    abstract buildProperty(payload: T): T;
    mutate?(property: T, creature: Creature, item: Item): void;
    attack?(property: T, attack: Attack): void;
    attacked?(property: T, attack: Attack): void;
}
