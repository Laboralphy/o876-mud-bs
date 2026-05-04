function cloneArray<T>(aArray: T[], seen: WeakSet<object>): T[] {
    return aArray.map((item) => deepClone(item, seen));
}

function cloneObject<T extends object>(oObject: T, seen: WeakSet<object>): T {
    const oOutput = {} as T;
    for (const sKey in oObject) {
        if (Object.hasOwn(oObject, sKey)) {
            oOutput[sKey] = deepClone(oObject[sKey], seen);
        }
    }
    return oOutput;
}

/**
 * Deep clones an item.
 * Supports primitives, arrays, objects, Dates, and Sets.
 * Functions are returned by reference.
 *
 */
export function deepClone<T>(oItem: T, seen: WeakSet<object> = new WeakSet()): T {
    if (oItem === null) {
        return null as unknown as T;
    }

    switch (typeof oItem) {
        case 'object': {
            if (Array.isArray(oItem)) {
                return cloneArray(oItem, seen) as unknown as T;
            } else if (oItem instanceof Date) {
                return new Date(oItem) as unknown as T;
            } else if (oItem instanceof Set) {
                return new Set(cloneArray([...oItem], seen)) as unknown as T;
            } else {
                if (seen.has(oItem)) {
                    throw new Error('ERR_MERGE_RECURSIVE');
                }
                seen.add(oItem);
                return cloneObject(oItem as unknown as object, seen) as T;
            }
        }

        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined': {
            return oItem;
        }

        default: {
            // could be a function or bigint or symbol
            return oItem;
        }
    }
}
