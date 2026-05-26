import { Creature } from '../../Creature';
import { Environment } from '../../schemas/enums/Environment';
import type { LocationRegistry } from './LocationRegistry';

export class Location {
    private readonly _creatures = new Set<Creature>();
    public readonly environments = new Set<Environment>();
    public registry: LocationRegistry | null = null;

    constructor(public readonly id: string) {}

    addCreature(creature: Creature): void {
        this._creatures.add(creature);
        creature.location = this;
    }

    removeCreature(creature: Creature): void {
        this._creatures.delete(creature);
        if (creature.location === this) {
            creature.location = null;
        }
    }

    get creatures(): Set<Creature> {
        return this._creatures;
    }

    /**
     * Returns all creatures in the same group as the specified creature
     * @param creature
     */
    getGroupmateCreatures(creature: Creature): Creature[] {
        return [...this._creatures].filter((c) => c.group === creature.group);
    }
}
