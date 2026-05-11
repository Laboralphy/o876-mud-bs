import { Creature } from '../../Creature';
import { EffectRegeneration } from '../schemas/regeneration';
import { DamageType } from '../../schemas/enums/DamageType';
import { IProgram } from '../../interfaces/IProgram';

export class EffectProgramRegeneration implements IProgram<EffectRegeneration> {
    /**
     * each call, the creature is being healed, unless the hp fraction is above a threshold
     * @param prop
     * @param creature
     */
    mutate(prop: EffectRegeneration, creature: Creature): void {
        const dice = creature.dice;
        // amp, // regen amplitude
        // vulnerabilities, // liste of damage types the creature is vulnerable to
        // useBodyModifier, // should i use body modifier to increase amount
        // shutdown, // number of hitpoint to soak up before regenerating again
        // threshold // Above this value, no regeneration
        let amount: number = dice.roll(prop.amp);
        if (prop.shutdown > amount) {
            prop.shutdown -= amount;
            return;
        }
        if (prop.shutdown > 0) {
            amount -= prop.shutdown;
            prop.shutdown = 0;
        }
        const hpmax = creature.getters.getMaxHitPoints;
        const hp = creature.hitPoints;
        const frac = hp / hpmax;
        if (amount > 0 && frac < prop.threshold) {
            creature.hitPoints += amount;
        }
    }

    /**
     * If damaged by a damage type present in the vulnerability, the shutdown effect is increased
     * instead of the hitpoints
     */
    damaged?(prop: EffectRegeneration, amount: number, damageType: DamageType): void {
        const vulnerabilities = prop.vulnerabilities;
        if (vulnerabilities && vulnerabilities.includes(damageType)) {
            prop.shutdown += amount;
        }
    }
}
