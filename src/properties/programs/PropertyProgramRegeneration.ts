import { z } from 'zod';
import { Creature } from '../../Creature';
import { DamageType } from '../../schemas/enums/DamageType';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertyRegeneration } from '../schemas/healing/regeneration';

type TPropertyRegeneration = z.infer<typeof PropertyRegeneration>;

export class PropertyProgramRegeneration implements IProgram<Property> {
    mutate(prop: Property, creature: Creature): void {
        const dice = creature.dice;
        const d = prop.data as TPropertyRegeneration;
        let amount: number = dice.roll(d.amp);
        if (d.shutdown > amount) {
            d.shutdown -= amount;
            return;
        }
        if (d.shutdown > 0) {
            amount -= d.shutdown;
            d.shutdown = 0;
        }
        const hpmax = creature.getters.getMaxHitPoints;
        const hp = creature.hitPoints;
        if (amount > 0 && hp / hpmax < d.threshold) {
            creature.hitPoints += amount;
        }
    }

    damaged?(prop: Property, amount: number, damageType: DamageType): void {
        const d = prop.data as TPropertyRegeneration;
        if (d.vulnerabilities?.includes(damageType)) {
            d.shutdown += amount;
        }
    }
}
