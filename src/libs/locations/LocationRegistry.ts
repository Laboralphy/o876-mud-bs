import { Location } from './Location';
import { Environment } from '../../schemas/enums/Environment';
import { Creature } from '../../Creature';

export class LocationRegistry {
    private readonly _locations = new Map<string, Location>();

    defineLocation(id: string, environments: Environment[] = []): Location {
        const location = new Location(id);
        for (const env of environments) {
            location.environments.add(env);
        }
        this._locations.set(id, location);
        return location;
    }

    getLocation(id: string): Location | undefined {
        return this._locations.get(id);
    }

    get locations(): Map<string, Location> {
        return this._locations;
    }

    moveCreature(creature: Creature, idLocation: string) {
        const prevLocation = creature.location;
        if (prevLocation) {
            prevLocation.removeCreature(creature);
        }
        const newLocation = this._locations.get(idLocation);
        if (newLocation) {
            newLocation.addCreature(creature);
        }
    }
}
