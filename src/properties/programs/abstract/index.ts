import { Property } from '../../../schemas/Property';
import { Creature } from '../../../Creature';
import { Item } from '../../../schemas/Item';
import { Attack } from '../../../Attack';

export abstract class PropertyProgramAbstract<T extends object> {
    abstract buildProperty(payload: T): Property;
    mutate?(property: Property, creature: Creature, item: Item): void;
    attack?(property: Property, attack: Attack): void;
    attacked?(property: Property, attack: Attack): void;
}
