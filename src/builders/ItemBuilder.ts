import { Item, ItemSchema } from '../schemas/Item';
import { ItemBlueprint } from '../schemas/ItemBlueprint';
import { PropertyBuilder } from './PropertyBuilder';

export class ItemBuilder {
    static buildItem(blueprint: ItemBlueprint, id: string): Item {
        return ItemSchema.parse({
            ...blueprint,
            id,
            properties: blueprint.properties.map((def) => PropertyBuilder.buildProperty(def)),
        });
    }
}
