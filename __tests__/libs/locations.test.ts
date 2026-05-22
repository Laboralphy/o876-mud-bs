import { describe, it, expect, beforeEach } from 'vitest';
import { Creature } from '../../src/Creature';
import { Location } from '../../src/libs/locations/Location';
import { LocationRegistry } from '../../src/libs/locations/LocationRegistry';
import { CONSTS } from '../../src/consts';

describe('Location', () => {
    let location: Location;
    let creature: Creature;

    beforeEach(() => {
        location = new Location('room-1');
        creature = new Creature('c1');
    });

    it('has correct id', () => {
        expect(location.id).toBe('room-1');
    });

    it('starts with empty creatures set', () => {
        expect(location.creatures.size).toBe(0);
    });

    it('starts with empty environments set', () => {
        expect(location.environments.size).toBe(0);
    });

    describe('addCreature', () => {
        it('adds creature to the creatures set', () => {
            location.addCreature(creature);
            expect(location.creatures.has(creature)).toBe(true);
        });

        it('sets creature.location to this location', () => {
            location.addCreature(creature);
            expect(creature.location).toBe(location);
        });

        it('can hold multiple creatures', () => {
            const c2 = new Creature('c2');
            location.addCreature(creature);
            location.addCreature(c2);
            expect(location.creatures.size).toBe(2);
        });
    });

    describe('removeCreature', () => {
        beforeEach(() => {
            location.addCreature(creature);
        });

        it('removes creature from the creatures set', () => {
            location.removeCreature(creature);
            expect(location.creatures.has(creature)).toBe(false);
        });

        it('sets creature.location to null', () => {
            location.removeCreature(creature);
            expect(creature.location).toBeNull();
        });

        it('does not null creature.location if creature moved to a different location first', () => {
            const otherLocation = new Location('room-2');
            creature.location = otherLocation;
            location.removeCreature(creature);
            expect(creature.location).toBe(otherLocation);
        });

        it('is a no-op for a creature not in the set', () => {
            const stranger = new Creature('stranger');
            expect(() => location.removeCreature(stranger)).not.toThrow();
            expect(location.creatures.size).toBe(1);
        });
    });
});

describe('LocationRegistry', () => {
    let registry: LocationRegistry;

    beforeEach(() => {
        registry = new LocationRegistry();
    });

    describe('defineLocation', () => {
        it('creates a location with the correct id', () => {
            const loc = registry.defineLocation('room-1');
            expect(loc.id).toBe('room-1');
        });

        it('registers the location in the map', () => {
            const loc = registry.defineLocation('room-1');
            expect(registry.locations.get('room-1')).toBe(loc);
        });

        it('seeds environments from the parameter', () => {
            const loc = registry.defineLocation('room-1', [
                CONSTS.ENVIRONMENT_DARKNESS,
                CONSTS.ENVIRONMENT_FOG,
            ]);
            expect(loc.environments.has(CONSTS.ENVIRONMENT_DARKNESS)).toBe(true);
            expect(loc.environments.has(CONSTS.ENVIRONMENT_FOG)).toBe(true);
        });

        it('leaves environments empty when none are provided', () => {
            const loc = registry.defineLocation('room-1');
            expect(loc.environments.size).toBe(0);
        });
    });

    describe('getLocation', () => {
        it('returns the location for a known id', () => {
            const loc = registry.defineLocation('room-1');
            expect(registry.getLocation('room-1')).toBe(loc);
        });

        it('returns undefined for an unknown id', () => {
            expect(registry.getLocation('unknown')).toBeUndefined();
        });
    });

    describe('moveCreature', () => {
        let creature: Creature;
        let room1: Location;
        let room2: Location;

        beforeEach(() => {
            creature = new Creature('c1');
            room1 = registry.defineLocation('room-1');
            room2 = registry.defineLocation('room-2');
        });

        it('moves creature from one location to another', () => {
            room1.addCreature(creature);
            registry.moveCreature(creature, 'room-2');
            expect(room1.creatures.has(creature)).toBe(false);
            expect(room2.creatures.has(creature)).toBe(true);
        });

        it('updates creature.location to the new location', () => {
            room1.addCreature(creature);
            registry.moveCreature(creature, 'room-2');
            expect(creature.location).toBe(room2);
        });

        it('works when creature has no previous location', () => {
            registry.moveCreature(creature, 'room-1');
            expect(room1.creatures.has(creature)).toBe(true);
            expect(creature.location).toBe(room1);
        });

        it('removes creature from old location when target id is unknown', () => {
            room1.addCreature(creature);
            registry.moveCreature(creature, 'no-such-room');
            expect(room1.creatures.has(creature)).toBe(false);
            expect(creature.location).toBeNull();
        });

        it('registers creature in the creature map when moved to a valid location', () => {
            registry.moveCreature(creature, 'room-1');
            expect(registry.getCreature(creature.id)).toBe(creature);
        });

        it('sets creature.registry to this registry when moved to a valid location', () => {
            registry.moveCreature(creature, 'room-1');
            expect(creature.registry).toBe(registry);
        });

        it('keeps creature registered when moving between two valid locations', () => {
            registry.moveCreature(creature, 'room-1');
            registry.moveCreature(creature, 'room-2');
            expect(registry.getCreature(creature.id)).toBe(creature);
            expect(creature.registry).toBe(registry);
        });

        it('unregisters creature when moved to limbo (unknown location)', () => {
            registry.moveCreature(creature, 'room-1');
            registry.moveCreature(creature, 'limbo');
            expect(registry.getCreature(creature.id)).toBeUndefined();
        });

        it('sets creature.registry to null when moved to limbo', () => {
            registry.moveCreature(creature, 'room-1');
            registry.moveCreature(creature, 'limbo');
            expect(creature.registry).toBeNull();
        });
    });

    describe('getCreature', () => {
        it('returns undefined for an unknown id', () => {
            expect(registry.getCreature('nobody')).toBeUndefined();
        });

        it('returns the creature instance by id after registration', () => {
            const creature = new Creature('c1');
            registry.defineLocation('room-1');
            registry.moveCreature(creature, 'room-1');
            expect(registry.getCreature('c1')).toBe(creature);
        });

        it('can look up multiple creatures independently', () => {
            const c1 = new Creature('c1');
            const c2 = new Creature('c2');
            registry.defineLocation('room-1');
            registry.moveCreature(c1, 'room-1');
            registry.moveCreature(c2, 'room-1');
            expect(registry.getCreature('c1')).toBe(c1);
            expect(registry.getCreature('c2')).toBe(c2);
        });
    });
});

describe('Creature.isInBrightLocation', () => {
    let registry: LocationRegistry;
    let creature: Creature;

    beforeEach(() => {
        registry = new LocationRegistry();
        creature = new Creature('c1');
    });

    it('returns false when creature has no location', () => {
        expect(creature.isInBrightLocation()).toBe(false);
    });

    it('returns true in a plain location with no environments', () => {
        const room = registry.defineLocation('room');
        room.addCreature(creature);
        expect(creature.isInBrightLocation()).toBe(true);
    });

    it('returns false in a fog location', () => {
        const room = registry.defineLocation('room', [CONSTS.ENVIRONMENT_FOG]);
        room.addCreature(creature);
        expect(creature.isInBrightLocation()).toBe(false);
    });

    it('returns false in a dark location with no light sources', () => {
        const room = registry.defineLocation('room', [CONSTS.ENVIRONMENT_DARKNESS]);
        room.addCreature(creature);
        expect(creature.isInBrightLocation()).toBe(false);
    });

    it('returns true in a dark location when another creature has PROPERTY_LIGHT', () => {
        const room = registry.defineLocation('room', [CONSTS.ENVIRONMENT_DARKNESS]);
        const lightBearer = new Creature('light-bearer');
        lightBearer.state.properties.push({ type: CONSTS.PROPERTY_LIGHT });
        room.addCreature(creature);
        room.addCreature(lightBearer);
        expect(creature.isInBrightLocation()).toBe(true);
    });

    it('returns true when the creature itself has PROPERTY_LIGHT in a dark location', () => {
        const room = registry.defineLocation('room', [CONSTS.ENVIRONMENT_DARKNESS]);
        creature.state.properties.push({ type: CONSTS.PROPERTY_LIGHT });
        room.addCreature(creature);
        expect(creature.isInBrightLocation()).toBe(true);
    });
});
