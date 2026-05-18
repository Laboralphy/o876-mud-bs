import { Property } from '../../properties/schemas';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { PropertyType, PropertyTypeSchema } from '../../schemas/enums/PropertyType';
import { GetterReturnType } from '../../store/define-getters';
import { Dice } from '../dice';
import { EffectType, EffectTypeSchema } from '../../schemas/enums/EffectType';
import { Effect } from '../../effects/schemas';

export interface AggregatorFunc<T> {
    filter?(pe: T): boolean;
    ampMapper?(pe: T): number;
    discriminator?(pe: T): string;
    forEach?(pe: T): void;
}

export type PropertyAggregatorOptions = {
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

export type AggregatorAccumulator = {
    sum: number;
    max: number;
    min: number;
    count: number;
};

export type Discriminator = Record<string, AggregatorAccumulator>;

export type AggregatorResult = AggregatorAccumulator & {
    discriminator: Discriminator;
};

const dice = new Dice();

/**
 * Returns the accumulator entry for sKey in oSorter, creating it with zeroed values if absent.
 * @param oSorter discriminator registry being built
 * @param sKey grouping key returned by the discriminator function
 * @returns the accumulator for that key
 */
function getDiscriminatorRegistry(oSorter: Discriminator, sKey: string) {
    if (!(sKey in oSorter)) {
        oSorter[sKey] = {
            sum: 0,
            min: Infinity,
            max: -Infinity,
            count: 0,
        };
    }
    return oSorter[sKey];
}

export interface IAggregatorGetters {
    get getInnateProperties(): Property[];
    get getEquipmentProperties(): Property[];
    get getEquipmentSlotProperties(): Record<string, Property[]>;
    get getEffects(): Effect[];
}

/**
 * The property reducing function.
 * Aggregates properties "amp" based on provided criteria.
 * The purpose is to calculate the sum, min, max, and count of property amps for the given property types.
 *
 * @param aWantedProperties array of wanted property types. example: [CONSTS.PROPERTY_ABILITY_MODIFIER, ... ]
 * @param getters reference to store getters
 * @param oFunctions set of filter/transform functions
 * @param options misc options for restricting property scanning to a limited set of slot, or exclude innate properties.
 * @return the returned structure provide the sum, the min value, the max value off all property amps, as well as a
 * registry of discriminated structure base on property type.
 */
export function aggregateProperties(
    aWantedProperties: PropertyType[],
    getters: IAggregatorGetters,
    oFunctions: AggregatorFunc<Property>,
    options: PropertyAggregatorOptions
): AggregatorResult {
    // equipment slot restriction, an empty array means no restriction
    const restrictSlots: EquipmentSlot[] = options?.restrictSlots ?? [];
    // if true, exclude innate properties, and only work with equipment item properties
    const excludeInnate = options?.excludeInnate ?? false;
    const aTypeSet = new Set<PropertyType>(aWantedProperties);
    // Initially starting with an empty array
    const aStartingProperties: Property[] = [];
    if (restrictSlots.length > 0) {
        // There is slot restriction
        // Only get properties from item of these slots
        if (!excludeInnate) {
            // Adds innate properties unless specified otherwise
            aStartingProperties.push(...getters.getInnateProperties);
        }
        // Get all properties ...
        const oSlotProperties = getters.getEquipmentSlotProperties;
        // But keep only properties for item of restricted slots
        restrictSlots.forEach((s: EquipmentSlot) => {
            if (oSlotProperties[s]) {
                aStartingProperties.push(...oSlotProperties[s]);
            }
        });
    } else {
        // No slot restriction
        if (!options.excludeInnate) {
            // include innate properties if options excludeInnate is false
            aStartingProperties.push(...getters.getInnateProperties);
        }
        // Appending all equipment item properties
        aStartingProperties.push(...getters.getEquipmentProperties);
    }
    // At this point, aStartingProperties contains all properties to be aggregated
    const aFilteredProperties: Property[] = aStartingProperties
        .filter(
            (ip: Property): boolean =>
                aTypeSet.has(ip.type) && (oFunctions?.filter ? oFunctions.filter(ip) : true)
        )
        .map((prop: Property): Property => {
            if ('amp' in prop.data) {
                const mappedAmp = oFunctions?.ampMapper
                    ? oFunctions.ampMapper(prop)
                    : dice.roll((prop.data as any).amp);
                return { ...prop, data: { ...prop.data, amp: mappedAmp } } as Property;
            } else {
                return prop;
            }
        });
    const ffe = oFunctions?.forEach;
    if (ffe) {
        // Applies a forEach function to all properties
        aFilteredProperties.forEach(ffe);
    }
    const oDiscriminator: Record<string, AggregatorAccumulator> = {};
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredProperties.forEach((pe: Property) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oDiscriminator, oFunctions.discriminator(pe));
                const amp: number = 'amp' in pe.data && typeof (pe.data as any).amp === 'number' ? (pe.data as any).amp : 0;
                sd.max = Math.max(sd.max, amp);
                sd.min = Math.min(sd.min, amp);
                sd.sum += amp;
                ++sd.count;
            }
        });
    }
    let nAccumulator = 0,
        nMin = Infinity,
        nMax = -Infinity;
    aFilteredProperties.forEach((pe: Property) => {
        if ('amp' in pe.data && typeof (pe.data as any).amp === 'number') {
            const amp = (pe.data as any).amp as number;
            nAccumulator += amp;
            nMax = Math.max(nMax, amp);
            nMin = Math.min(nMin, amp);
        }
    });
    return {
        sum: nAccumulator,
        max: nMax,
        min: nMin,
        count: aFilteredProperties.length,
        discriminator: oDiscriminator,
    };
}

/**
 * The effect reducing function.
 * Aggregates effects "amp" based on provided criteria.
 * Mirrors aggregateProperties but operates on the entity's active effects rather than its properties.
 *
 * @param aWantedEffects array of wanted effect types to include in the aggregation
 * @param getters reference to store getters
 * @param oFunctions set of filter/transform functions (filter, ampMapper, discriminator, forEach)
 * @returns the sum, min, max, and count of matching effect amps, plus a discriminator registry
 */
export function aggregateEffects(
    aWantedEffects: EffectType[],
    getters: IAggregatorGetters,
    oFunctions: AggregatorFunc<Effect>
): AggregatorResult {
    const aTypeSet = new Set<EffectType>(aWantedEffects);
    const aFilteredEffects: Effect[] = getters.getEffects
        .filter(
            (eff: Effect): boolean =>
                aTypeSet.has(eff.type) && (oFunctions?.filter ? oFunctions.filter(eff) : true)
        )
        .map((eff: Effect): Effect => {
            if ('amp' in eff.data) {
                const mappedAmp = oFunctions?.ampMapper
                    ? oFunctions.ampMapper(eff)
                    : (eff.data as any).amp;
                return { ...eff, data: { ...eff.data, amp: mappedAmp } } as Effect;
            } else {
                return eff;
            }
        });
    const ffe = oFunctions?.forEach;
    if (ffe) {
        // Applies a forEach function to all properties
        aFilteredEffects.forEach(ffe);
    }
    const oDiscriminator: Record<string, AggregatorAccumulator> = {};
    if (typeof oFunctions?.discriminator === 'function') {
        aFilteredEffects.forEach((eff: Effect) => {
            if (typeof oFunctions?.discriminator === 'function') {
                const sd = getDiscriminatorRegistry(oDiscriminator, oFunctions.discriminator(eff));
                const amp: number = 'amp' in eff.data && typeof (eff.data as any).amp === 'number' ? (eff.data as any).amp : 0;
                sd.max = Math.max(sd.max, amp);
                sd.min = Math.min(sd.min, amp);
                sd.sum += amp;
                ++sd.count;
            }
        });
    }
    let nAccumulator = 0,
        nMin = Infinity,
        nMax = -Infinity;
    aFilteredEffects.forEach((eff: Effect) => {
        if ('amp' in eff.data && typeof (eff.data as any).amp === 'number') {
            const amp = (eff.data as any).amp as number;
            nAccumulator += amp;
            nMax = Math.max(nMax, amp);
            nMin = Math.min(nMin, amp);
        }
    });
    return {
        sum: nAccumulator,
        max: nMax,
        min: nMin,
        count: aFilteredEffects.length,
        discriminator: oDiscriminator,
    };
}

export type AggregateOptions = {
    effects?: AggregatorFunc<Effect>;
    properties?: AggregatorFunc<Property>;
    excludeInnate?: boolean;
    restrictSlots?: EquipmentSlot[];
};

/**
 * Merges a2 into a1 in place: sums are added, counts are added, min/max are taken across both.
 * @param a1 target accumulator — mutated and returned
 * @param a2 source accumulator — read only
 * @returns a1 after mutation
 */
export function mergeAccumulators(
    a1: AggregatorAccumulator,
    a2: AggregatorAccumulator
): AggregatorAccumulator {
    a1.sum += a2.sum;
    a1.min = Math.min(a1.min, a2.min);
    a1.max = Math.max(a1.max, a2.max);
    a1.count += a2.count;
    return a1;
}

/**
 * Merges two AggregatorResults into a1 in place.
 * Discriminator keys present in both results are merged with mergeAccumulators;
 * keys present only in a2 are copied directly into a1.
 * @param a1 target result — mutated and returned
 * @param a2 source result — read only
 * @returns a1 after mutation
 */
export function mergeResults(a1: AggregatorResult, a2: AggregatorResult) {
    const discriminator: Discriminator = a1.discriminator;
    for (const [name, value] of Object.entries(a2.discriminator)) {
        if (name in discriminator) {
            discriminator[name] = mergeAccumulators(discriminator[name], value);
        } else {
            discriminator[name] = value;
        }
    }
    mergeAccumulators(a1, a2);
    a1.discriminator = discriminator;
    return a1;
}

/**
 * Unified aggregation entry point that handles both effects and properties in a single call.
 * Splits the mixed type list into effect types and property types, runs each dedicated
 * aggregator, then merges the two results into one.
 *
 * @param types mixed array of EffectType and PropertyType values to aggregate
 * @param options aggregation options: per-type function hooks (filter, ampMapper, etc.)
 *                and slot/innate restrictions applied to the property pass
 * @param getters reference to store getters
 * @returns merged AggregatorResult combining effects and properties
 */
export function aggregate(
    types: (EffectType | PropertyType)[],
    options: AggregateOptions,
    getters: GetterReturnType
): AggregatorResult {
    const effTypes = types.filter((t) => EffectTypeSchema.safeParse(t).success) as EffectType[];
    const propTypes = types.filter(
        (t) => PropertyTypeSchema.safeParse(t).success
    ) as PropertyType[];
    const propOptions = {
        excludeInnate: options.excludeInnate ?? false,
        restrictSlots: options.restrictSlots ?? [],
    };

    return mergeResults(
        aggregateEffects(effTypes, getters, options.effects ?? {}),
        aggregateProperties(propTypes, getters, options.properties ?? {}, propOptions)
    );
}
