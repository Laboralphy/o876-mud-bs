import { Combat } from './Combat';
import { Creature } from '../../Creature';
import { Distance } from '../../schemas/enums/Distance';

export class CombatManager {
    public readonly combats = new Map<Creature, Combat>();

    createCombat(attacker: Creature, target: Creature): Combat {
        const combat = new Combat(attacker, target);
        this.combats.set(attacker, combat);
        combat.events.on('distance-changed', (data: { distance: Distance }) => {
            const { distance } = data;
            this.getMirroredCombat(combat)?.setDistance(distance, true);
        });
        if (!this.getCombat(target)) {
            this.createCombat(target, attacker);
        }
        return combat;
    }

    getCombat(creature: Creature): Combat | undefined {
        return this.combats.get(creature);
    }

    getMirroredCombat(combat: Combat): Combat | undefined {
        return this.getCombat(combat.target);
    }

    /**
     * Returns all combats involving the specified creature as target
     * @param creature
     */
    getAllInvolvedCombats(creature: Creature): Combat[] {
        return [...this.combats.values()].filter((combat) => combat.target === creature);
    }

    disposeCombat(combat: Combat, _bUnilateral: boolean = false) {
        // unilateral disengagement — mirrors get an opportunity attack then also stops
        const clist = this.getAllInvolvedCombats(combat.attacker);
        for (const c of clist) {
            if (_bUnilateral) {
                c.opportunityAttack();
            }
            this.combats.delete(c.attacker);
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
