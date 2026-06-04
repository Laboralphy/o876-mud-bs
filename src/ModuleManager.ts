import { ExtendResolver } from './libs/extend-resolver';
import { ExtendableEntity } from './libs/extend-resolver/ExtendResolver';
import { ItemBlueprint, ItemBlueprintSchema } from './schemas/ItemBlueprint';
import { CreatureBlueprint, CreatureBlueprintSchema } from './schemas/CreatureBlueprint';
import { ModuleStructure } from './schemas/ModuleStructure';
import { CreatureActionScript } from './schemas/CreatureActionScript';

function validateCreature(entity: ExtendableEntity): CreatureBlueprint {
    return CreatureBlueprintSchema.parse(entity);
}

function validateItem(entity: ExtendableEntity): ItemBlueprint {
    return ItemBlueprintSchema.parse(entity);
}

export class ModuleManager {
    private readonly extendResolver = new ExtendResolver();
    private readonly scripts = new Map<string, CreatureActionScript>();

    addAsset(ref: string, entity: ExtendableEntity) {
        this.extendResolver.declareEntity(ref, entity);
    }

    getAsset<T>(ref: string, validator: (x: ExtendableEntity) => T): T {
        return validator(this.extendResolver.resolveEntity(ref));
    }

    getResRefList() {
        return this.extendResolver.keys
    }

    loadModuleBlueprints(moduleContent: Record<string, ExtendableEntity>) {
        for (const [key, asset] of Object.entries(moduleContent)) {
            this.addAsset(key, asset);
        }
    }

    loadModuleScripts(moduleScripts: Record<string, CreatureActionScript>) {
        for (const [scriptId, script] of Object.entries(moduleScripts)) {
            this.scripts.set(scriptId, script);
        }
    }

    loadModule(module: ModuleStructure) {
        if (module.blueprints) {
            this.loadModuleBlueprints(module.blueprints);
        }
        if (module.thinkers) {
            this.loadModuleScripts(module.thinkers);
        }
        if (module.actions) {
            this.loadModuleScripts(module.actions);
        }
    }

    defineScript(scriptId: string, fn: CreatureActionScript) {
        this.scripts.set(scriptId, fn);
    }

    getScript(scriptId: string): CreatureActionScript | undefined {
        return this.scripts.get(scriptId);
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
