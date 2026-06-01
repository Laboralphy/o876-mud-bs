import { ExtendResolver } from './libs/extend-resolver';
import { ExtendableEntity } from './libs/extend-resolver/ExtendResolver';
import { Creature } from './Creature';
import { PropertyDefinition } from './properties/schemas';
import { PropertyBuilder } from './builders/PropertyBuilder';
import { ItemBlueprint, ItemBlueprintSchema } from './schemas/ItemBlueprint';
import { Item } from './schemas/Item';
import { ActionBlueprint, ActionState } from './schemas/Action';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';

function validateCreature(entity: ExtendableEntity): CreatureBlueprint {
    return CreatureBlueprintSchema.parse(entity);
}

function validateItem(entity: ExtendableEntity): ItemBlueprint {
    return ItemBlueprintSchema.parse(entity);
}

export class ModuleManager {
    private readonly extendResolver = new ExtendResolver();

    addAsset(ref: string, entity: ExtendableEntity) {
        this.extendResolver.declareEntity(ref, entity);
    }

    getAsset<T>(ref: string, validator: (x: ExtendableEntity) => T): T {
        return validator(this.extendResolver.resolveEntity(ref));
    }

    loadModule(moduleContent: Record<string, ExtendableEntity>) {
        for (const [key, asset] of Object.entries(moduleContent)) {
            this.addAsset(key, asset);
        }
    }

    /**
     * Returns a valid creature blueprint
     * @param resref resource reference
     * @return validated CreatureBlueprint
     */
    getCreatureBlueprint(resref: string): CreatureBlueprint {
        return this.getAsset<CreatureBlueprint>(resref, validateCreature);
    }

    getItemBlueprint(resref: string): ItemBlueprint {
        return this.getAsset<ItemBlueprint>(resref, validateItem);
    }
}
