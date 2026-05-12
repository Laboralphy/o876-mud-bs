import { z } from 'zod';
import { Creature } from '../../Creature';
import { DamageType } from '../../schemas/enums/DamageType';
import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { EffectRegenerationSchema } from '../schemas/regeneration';

type EffectRegeneration = z.infer<typeof EffectRegenerationSchema>;

export class EffectProgramRegeneration implements IProgram<Effect> {
    /**
     * each call, the creature is being healed, unless the hp fraction is above a threshold
     * @param prop
     * @param creature
     */
    mutate(prop: Effect, creature: Creature): void {
        const p = prop as EffectRegeneration;
        const dice = creature.dice;
        let amount: number = dice.roll(p.amp);
        if (p.shutdown > amount) {
            p.shutdown -= amount;
            return;
        }
        if (p.shutdown > 0) {
            amount -= p.shutdown;
            p.shutdown = 0;
        }
        const hpmax = creature.getters.getMaxHitPoints;
        const hp = creature.hitPoints;
        if (amount > 0 && hp / hpmax < p.threshold) {
            creature.hitPoints += amount;
        }
    }

    /**
     * If damaged by a damage type present in the vulnerability, the shutdown effect is increased
     * instead of the hitpoints
     */
    damaged?(prop: Effect, amount: number, damageType: DamageType): void {
        const p = prop as EffectRegeneration;
        if (p.vulnerabilities?.includes(damageType)) {
            p.shutdown += amount;
        }
    }
}
