import { EntityType } from '../../schemas/enums/EntityType';

export interface ExtendableEntity {
    extends?: string[];
    [key: string]: any;
}

/**
 * This class is aimed at resolving extends inside JSON structure
 */
export class ExtendResolver {
    private readonly entities = new Map<string, ExtendableEntity>();

    declareEntity(ref: string, obj: ExtendableEntity): void {
        this.entities.set(ref, obj);
    }

    get keys(): string[] {
        return [...this.entities.keys()];
    }

    getEntityType(ref: string): EntityType {
        const oEntity = this.entities.get(ref);
        if (oEntity === undefined) {
            throw new ReferenceError(`Entity ${ref} not found`);
        } else {
            return oEntity.entityType;
        }
    }

    resolveEntity(ref: string, seen: Set<string> = new Set<string>()): ExtendableEntity {
        if (!this.entities.has(ref)) {
            throw new ReferenceError(`Entity ${ref} not found`);
        }
        if (seen.has(ref)) {
            return {};
        }
        seen.add(ref);
        const baseEntity = { ...this.entities.get(ref) } as ExtendableEntity;
        for (const x of baseEntity.extends ?? []) {
            const extendedEntity = this.resolveEntity(x, seen);
            for (const [name, value] of Object.entries(extendedEntity)) {
                const bAlreadyDefined = name in baseEntity;
                const bPropIsArray =
                    bAlreadyDefined &&
                    Array.isArray(baseEntity[name]) &&
                    Array.isArray(extendedEntity[name]);
                if (bPropIsArray) {
                    // Property is already defined and is an array
                    baseEntity[name] = [...baseEntity[name], ...extendedEntity[name]];
                }
                if (!(name in baseEntity)) {
                    // This property does not exist in base entity
                    // We can set it in the base entity
                    baseEntity[name] = value;
                }
            }
        }
        delete baseEntity.extends;
        return baseEntity;
    }
}
