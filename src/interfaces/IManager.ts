import { Creature } from '../Creature';

export interface IManager {
    // Combat control
    startCombat(attacker: Creature, target: Creature): void;
    stopCombat(creature: Creature, bDisengage?: boolean): void;
    isFighting(creature: Creature, target?: Creature): boolean;
    getCombatTarget(creature: Creature): Creature | undefined;
    getCombatAggressors(creature: Creature): Creature[];

    // Action routing
    doAction(creature: Creature, actionId: string, target: Creature | undefined): void;

    // Creature queries
    getCreature(id: string): Creature | undefined;
}
