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

    /**
     * Return the most suitable weapon for the present situation
     * - If distance far, medium and attacker have ranged weapon with ammo -> switch to ranged weapon
     * - If distance far, medium and no ranged weapon -> switch to melee weapon
     * - If distance close switch to melee weapon
     */
    switchToSuitableWeapon() {
        const distance = this.distance.value;
        switch (distance) {
            case DISTANCE.FAR:
            case DISTANCE.MEDIUM: {
                if (this.attacker.getters.isRangedWeaponLoaded) {
                    // switch to ranged weapon
                } else {
                    // switch to melee weapon
                }
            }
        }
    }
}
