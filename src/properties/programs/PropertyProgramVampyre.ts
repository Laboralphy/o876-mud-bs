import { Property } from '../schemas';
import { Attack } from '../../Attack';
import z from 'zod';
import { CONSTS } from '../../consts';
import { PropertyVampyre } from '../schemas/healing/vampyre';

type TPropertyVampyre = z.infer<typeof PropertyVampyre>;

export class PropertyProgramVampyre {
    attack(prop: Property, attack: Attack): void {
        const { hit, attacker } = attack;
        const propVampyreData = prop.data as TPropertyVampyre;
        const sDamageType = propVampyreData.damageType;
        if (hit && attacker.hitPoints < attacker.getters.getMaxHitPoints) {
            // the vampyre hits the target
            // the vampyre needs healing
            const damageDealt = attack.damages
                .filter((d) => d.damageType === sDamageType)
                .map((d) => d.amount)
                .reduce((acc, d) => acc + d, 0);
            const amount = Math.ceil(damageDealt * propVampyreData.amp);
            attacker.applyEffect({
                type: CONSTS.EFFECT_HEAL,
                amp: amount,
            });
        }
    }
}
