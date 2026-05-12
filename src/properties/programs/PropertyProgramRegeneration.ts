import { z } from 'zod';
import { Creature } from '../../Creature';
import { DamageType } from '../../schemas/enums/DamageType';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertySchemaRegeneration } from '../schemas/regeneration';

type PropertyRegeneration = z.infer<typeof PropertySchemaRegeneration>;

export class PropertyProgramRegeneration implements IProgram<Property> {
    /**
     * each call, the creature is being healed, unless the hp fraction is above a threshold
     * @param prop
     * @param creature
     */
    mutate(prop: Property, creature: Creature): void {
        const p = prop as PropertyRegeneration;
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
     * If damaged by a damage type present in the vulnerability, the shutdown property is increased
     * instead of the hitpoints
     */
    damaged?(prop: Property, amount: number, damageType: DamageType): void {
        const p = prop as PropertyRegeneration;
        if (p.vulnerabilities?.includes(damageType)) {
            p.shutdown += amount;
        }
    }
}
