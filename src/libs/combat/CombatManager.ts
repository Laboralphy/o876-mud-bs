import { Combat } from './Combat';
import { Creature } from '../../Creature';
import { DISTANCE } from '../distance';

export class CombatManager {
    public readonly combats = new Map<Creature, Combat>();

    /**
     * Creates a new combat, create a second combat if bBoth is true
     * @param attacker
     * @param target
     * @param bBoth
     */
    createCombat(attacker: Creature, target: Creature, bBoth: boolean = false): Combat {
        const combat = new Combat(attacker, target);
        this.combats.set(attacker, combat);
        combat.events.on('distance-changed', (data: { distance: DISTANCE }) => {
            const { distance } = data;
            this.getMirroredCombat(combat)?.setDistance(distance, true);
        });
        if (bBoth) {
            this.createCombat(target, attacker, false);
        }
        return combat;
    }

    getCombat(creature: Creature): Combat | undefined {
        return this.combats.get(creature);
    }

    getMirroredCombat(combat: Combat): Combat | undefined {
        const target = combat.target;
        return this.getCombat(target);
    }

    disposeCombat(combat: Combat, bBoth: boolean = false) {
        if (bBoth) {
            const mr = this.getMirroredCombat(combat);
            if (mr) {
                this.disposeCombat(mr, false);
            }
        }
        this.combats.delete(combat.attacker);
    }

    /**
     * In a combat with creatures A -> T, when distance changes, synchronize the combat distance with T -> A
     */
    synchronizeCombatDistance(combat: Combat) {
        this.getMirroredCombat(combat)?.setDistance(combat.getDistance(), true);
    }

    playCombatRound(combat: Combat) {
        combat.playRound();
    }

    process() {
        for (const combat of this.combats.values()) {
            this.playCombatRound(combat);
        }
    }
}
