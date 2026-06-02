import { Combat } from './Combat';
import { Creature } from '../../Creature';
import { Distance } from '../../schemas/enums/Distance';

export class CombatManager {
    public readonly combats = new Map<Creature, Combat>();

    createCombat(attacker: Creature, target: Creature, bBoth: boolean = false): Combat {
        const combat = new Combat(attacker, target);
        this.combats.set(attacker, combat);
        combat.events.on('distance-changed', (data: { distance: Distance }) => {
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
        return this.getCombat(combat.target);
    }

    disposeCombat(combat: Combat, bBoth: boolean = false, bOpportunity: boolean = true) {
        const mr = this.getMirroredCombat(combat);
        if (bBoth) {
            // mutual stop — remove both sides silently
            if (mr) {
                this.combats.delete(mr.attacker);
            }
        } else {
            // unilateral disengagement — mirror gets an opportunity attack then also stops
            if (mr) {
                if (bOpportunity) {
                    mr.opportunityAttack();
                }
                this.combats.delete(mr.attacker);
            }
        }
        this.combats.delete(combat.attacker);
    }

    synchronizeCombatDistance(combat: Combat) {
        this.getMirroredCombat(combat)?.setDistance(combat.getDistance(), true);
    }

    process() {
        for (const combat of this.combats.values()) {
            combat.process();
        }
    }
}
