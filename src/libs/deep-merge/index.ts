import { deepClone } from '../deep-clone';

/**
 * Vérifie si la valeur est un objet (et pas un tableau ou null).
 */
function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Fusionne profondément deux objets.
 * @param target L'objet cible (modifié).
 * @param source L'objet source (à fusionner).
 * @param seen Pour détecter les références circulaires.
 * @returns L'objet cible fusionné.
 */
export function deepMerge<T extends object, S extends object>(
    target: T,
    source: S,
    seen: WeakSet<object> = new WeakSet()
): T & S {
    if (!isObject(target) || !isObject(source)) {
        return { ...target, ...source } as T & S;
    }

    // Detect circular references
    if (seen.has(source)) {
        throw new Error('ERR_MERGE_RECURSIVE');
    }
    seen.add(source);

    const output = { ...target } as { [key: string]: unknown };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = target[key];

            if (isObject(sourceValue) && isObject(targetValue)) {
                // Recursive merge for embedded objects
                output[key] = deepMerge(targetValue, sourceValue, seen);
            } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
                // Merge arrays (each item is replaced by a deep copy)
                output[key] = sourceValue.map((item) => deepClone(item)) as any;
            } else {
                // Replace target value by source value
                output[key] = deepClone(sourceValue);
            }
        }
    }

    return output as T & S;
}
