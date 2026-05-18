import { describe, expect, it } from 'vitest';
import { aggregateProperties, IAggregatorGetters } from '../src/libs/aggregator/index';
import { Property } from '../src/properties/schemas';
import { PropertyType } from '../src/schemas/enums/PropertyType';
import { EquipmentSlot } from '../src/schemas/enums/EquipmentSlot';
import { Ability } from '../src/schemas/enums/Ability';
import { Effect } from '../src/effects/schemas';
import { makeAbilityModifierProperty, makeRegenProperty } from './helpers/helpers';

function makeAbilityModifier(amp: number, ability: Ability = 'ABILITY_BODY' as Ability): Property {
    return makeAbilityModifierProperty(amp, ability);
}

function makeGetters(
    innate: Property[] = [],
    equipment: Property[] = [],
    effects: Effect[] = [],
    slotProperties: Record<string, Property[]> = {}
): IAggregatorGetters {
    return {
        get getInnateProperties() {
            return innate;
        },
        get getEquipmentProperties() {
            return equipment;
        },
        get getEquipmentSlotProperties() {
            return slotProperties;
        },
        get getEffects() {
            return effects;
        },
    };
}

const WANTED: PropertyType[] = ['PROPERTY_ABILITY_MODIFIER'];
const NO_FUNCTIONS = {};
const NO_OPTIONS = {};

describe('aggregateProperties', () => {
    describe('basic aggregation', () => {
        it('returns zeroed result when no properties match', () => {
            const result = aggregateProperties(WANTED, makeGetters(), NO_FUNCTIONS, NO_OPTIONS);
            expect(result.sum).toBe(0);
            expect(result.count).toBe(0);
            expect(result.min).toBe(Infinity);
            expect(result.max).toBe(-Infinity);
            expect(result.discriminator).toEqual({});
        });

        it('computes sum, min, max, count from innate properties', () => {
            const getters = makeGetters([makeAbilityModifier(3), makeAbilityModifier(5)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, NO_OPTIONS);
            expect(result.sum).toBe(8);
            expect(result.count).toBe(2);
            expect(result.min).toBe(3);
            expect(result.max).toBe(5);
        });

        it('includes equipment properties', () => {
            const getters = makeGetters([], [makeAbilityModifier(2), makeAbilityModifier(4)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, NO_OPTIONS);
            expect(result.sum).toBe(6);
            expect(result.count).toBe(2);
        });

        it('combines innate and equipment properties', () => {
            const getters = makeGetters([makeAbilityModifier(1)], [makeAbilityModifier(2)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, NO_OPTIONS);
            expect(result.sum).toBe(3);
            expect(result.count).toBe(2);
        });
    });

    describe('type filtering', () => {
        it('ignores properties not in aWantedProperties', () => {
            const getters = makeGetters([
                makeAbilityModifier(5),
                makeRegenProperty(3),
            ]);
            const result = aggregateProperties(
                ['PROPERTY_ABILITY_MODIFIER'],
                getters,
                NO_FUNCTIONS,
                NO_OPTIONS
            );
            expect(result.count).toBe(1);
            expect(result.sum).toBe(5);
        });

        it('returns empty result when no property matches the wanted types', () => {
            const getters = makeGetters([makeAbilityModifier(5)]);
            const result = aggregateProperties(
                ['PROPERTY_REGENERATION'],
                getters,
                NO_FUNCTIONS,
                NO_OPTIONS
            );
            expect(result.count).toBe(0);
            expect(result.sum).toBe(0);
        });
    });

    describe('options.excludeInnate', () => {
        it('excludes innate properties when excludeInnate is true', () => {
            const getters = makeGetters([makeAbilityModifier(10)], [makeAbilityModifier(2)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                excludeInnate: true,
            });
            expect(result.sum).toBe(2);
            expect(result.count).toBe(1);
        });

        it('includes innate properties when excludeInnate is false', () => {
            const getters = makeGetters([makeAbilityModifier(10)], [makeAbilityModifier(2)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                excludeInnate: false,
            });
            expect(result.sum).toBe(12);
            expect(result.count).toBe(2);
        });
    });

    describe('options.restrictSlots', () => {
        it('only includes properties from specified slots', () => {
            const getters = makeGetters([], [], [], {
                EQUIPMENT_SLOT_HEAD: [makeAbilityModifier(3)],
                EQUIPMENT_SLOT_CHEST: [makeAbilityModifier(5)],
            });
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                restrictSlots: ['EQUIPMENT_SLOT_HEAD' as EquipmentSlot],
            });
            expect(result.sum).toBe(3);
            expect(result.count).toBe(1);
        });

        it('includes innate properties when restrictSlots is set and excludeInnate is not', () => {
            const getters = makeGetters([makeAbilityModifier(1)], [], [], {
                EQUIPMENT_SLOT_HEAD: [makeAbilityModifier(3)],
            });
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                restrictSlots: ['EQUIPMENT_SLOT_HEAD' as EquipmentSlot],
            });
            expect(result.sum).toBe(4);
            expect(result.count).toBe(2);
        });

        it('excludes innate when restrictSlots and excludeInnate are both set', () => {
            const getters = makeGetters([makeAbilityModifier(1)], [], [], {
                EQUIPMENT_SLOT_HEAD: [makeAbilityModifier(3)],
            });
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                restrictSlots: ['EQUIPMENT_SLOT_HEAD' as EquipmentSlot],
                excludeInnate: true,
            });
            expect(result.sum).toBe(3);
            expect(result.count).toBe(1);
        });

        it('returns empty when the restricted slot has no properties', () => {
            const getters = makeGetters([], [], [], {
                EQUIPMENT_SLOT_CHEST: [makeAbilityModifier(5)],
            });
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                restrictSlots: ['EQUIPMENT_SLOT_HEAD' as EquipmentSlot],
            });
            expect(result.count).toBe(0);
            expect(result.sum).toBe(0);
        });

        it('aggregates across multiple restricted slots', () => {
            const getters = makeGetters([], [], [], {
                EQUIPMENT_SLOT_HEAD: [makeAbilityModifier(3)],
                EQUIPMENT_SLOT_CHEST: [makeAbilityModifier(5)],
                EQUIPMENT_SLOT_FEET: [makeAbilityModifier(1)],
            });
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, {
                restrictSlots: ['EQUIPMENT_SLOT_HEAD', 'EQUIPMENT_SLOT_CHEST'] as EquipmentSlot[],
            });
            expect(result.sum).toBe(8);
            expect(result.count).toBe(2);
        });
    });

    describe('oFunctions.filter', () => {
        it('excludes properties that do not pass the filter', () => {
            const getters = makeGetters([
                makeAbilityModifier(2, 'ABILITY_BODY' as Ability),
                makeAbilityModifier(4, 'ABILITY_MIND' as Ability),
            ]);
            const result = aggregateProperties(
                WANTED,
                getters,
                {
                    filter: (p: Property) =>
                        p.type === 'PROPERTY_ABILITY_MODIFIER' &&
                        p.data.ability === 'ABILITY_BODY',
                },
                NO_OPTIONS
            );
            expect(result.count).toBe(1);
            expect(result.sum).toBe(2);
        });

        it('returns empty when filter rejects all properties', () => {
            const getters = makeGetters([makeAbilityModifier(5)]);
            const result = aggregateProperties(
                WANTED,
                getters,
                { filter: () => false },
                NO_OPTIONS
            );
            expect(result.count).toBe(0);
        });
    });

    describe('oFunctions.ampMapper', () => {
        it('applies ampMapper to override amp values', () => {
            const getters = makeGetters([makeAbilityModifier(5)]);
            const result = aggregateProperties(
                WANTED,
                getters,
                { ampMapper: () => 10 },
                NO_OPTIONS
            );
            expect(result.sum).toBe(10);
            expect(result.min).toBe(10);
            expect(result.max).toBe(10);
        });

        it('ampMapper receives the original property and can scale amp', () => {
            const getters = makeGetters([makeAbilityModifier(1), makeAbilityModifier(2)]);
            const result = aggregateProperties(
                WANTED,
                getters,
                {
                    ampMapper: (p: Property) =>
                        p.type === 'PROPERTY_ABILITY_MODIFIER' ? p.data.amp * 3 : 0,
                },
                NO_OPTIONS
            );
            expect(result.sum).toBe(9); // (1*3) + (2*3)
        });
    });

    describe('oFunctions.forEach', () => {
        it('calls forEach for each filtered property', () => {
            const getters = makeGetters([makeAbilityModifier(3), makeAbilityModifier(7)]);
            const visited: Property[] = [];
            aggregateProperties(
                WANTED,
                getters,
                {
                    forEach: (p: Property) => {
                        visited.push(p);
                    },
                },
                NO_OPTIONS
            );
            expect(visited).toHaveLength(2);
        });

        it('does not call forEach for filtered-out properties', () => {
            const getters = makeGetters([makeAbilityModifier(3), makeAbilityModifier(7)]);
            const visited: Property[] = [];
            aggregateProperties(
                WANTED,
                getters,
                {
                    filter: (p: Property) =>
                        p.type === 'PROPERTY_ABILITY_MODIFIER' && p.data.amp > 5,
                    forEach: (p: Property) => {
                        visited.push(p);
                    },
                },
                NO_OPTIONS
            );
            expect(visited).toHaveLength(1);
            expect(
                visited[0].type === 'PROPERTY_ABILITY_MODIFIER' && visited[0].data.amp
            ).toBe(7);
        });
    });

    describe('oFunctions.discriminator', () => {
        it('groups properties by discriminator key with correct stats', () => {
            const getters = makeGetters([
                makeAbilityModifier(3, 'ABILITY_BODY' as Ability),
                makeAbilityModifier(5, 'ABILITY_BODY' as Ability),
                makeAbilityModifier(2, 'ABILITY_MIND' as Ability),
            ]);
            const result = aggregateProperties(
                WANTED,
                getters,
                {
                    discriminator: (p: Property) =>
                        p.type === 'PROPERTY_ABILITY_MODIFIER' ? p.data.ability : 'unknown',
                },
                NO_OPTIONS
            );
            expect(result.discriminator['ABILITY_BODY'].sum).toBe(8);
            expect(result.discriminator['ABILITY_BODY'].count).toBe(2);
            expect(result.discriminator['ABILITY_BODY'].min).toBe(3);
            expect(result.discriminator['ABILITY_BODY'].max).toBe(5);
            expect(result.discriminator['ABILITY_MIND'].sum).toBe(2);
            expect(result.discriminator['ABILITY_MIND'].count).toBe(1);
            expect(result.discriminator['ABILITY_MIND'].min).toBe(2);
            expect(result.discriminator['ABILITY_MIND'].max).toBe(2);
        });

        it('returns empty discriminator when no discriminator function is provided', () => {
            const getters = makeGetters([makeAbilityModifier(3)]);
            const result = aggregateProperties(WANTED, getters, NO_FUNCTIONS, NO_OPTIONS);
            expect(result.discriminator).toEqual({});
        });

        it('overall stats are independent from discriminator grouping', () => {
            const getters = makeGetters([
                makeAbilityModifier(3, 'ABILITY_BODY' as Ability),
                makeAbilityModifier(7, 'ABILITY_MIND' as Ability),
            ]);
            const result = aggregateProperties(
                WANTED,
                getters,
                {
                    discriminator: (p: Property) =>
                        p.type === 'PROPERTY_ABILITY_MODIFIER' ? p.data.ability : 'unknown',
                },
                NO_OPTIONS
            );
            expect(result.sum).toBe(10);
            expect(result.min).toBe(3);
            expect(result.max).toBe(7);
            expect(result.count).toBe(2);
        });
    });
});
