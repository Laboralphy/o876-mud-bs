import { Creature } from '../../Creature';
import { DISTANCE, Distance } from '../distance';

/**
 * The combat class
 */
export class Combat {
    public readonly distance: Distance = new Distance(DISTANCE.FAR);

    constructor(
        public readonly attacker: Creature,
        public readonly target: Creature
    ) {}
}
