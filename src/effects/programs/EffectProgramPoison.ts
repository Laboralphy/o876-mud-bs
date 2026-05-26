import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';
import { DamageType } from '../../schemas/enums/DamageType';
import { getResistingSkill } from '../../libs/get-resisting-skill';

export class EffectProgramPoison implements IProgram<Effect> {
    private _dealDamage(
        damageType: DamageType,
        amount: number,
        creature: Creature,
        source: Creature | undefined
    ): void {
        const entry = creature.getters.getDamageMitigation[damageType];
        const reduction = entry?.reduction ?? 0;
        const factor = entry?.factor ?? 1;
        const mitigated = Math.max(0, Math.floor((amount - reduction) * factor));
        if (mitigated > 0) {
            creature.hitPoints -= mitigated;
            creature.triggerDamagedEvent(mitigated, damageType, source);
        }
    }

    mutate(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type !== CONSTS.EFFECT_POISON) {
            return;
        }
        const data = effect.data;
        ++data.timer;
        if (data.timer % data.periodicity !== 0) {
            return;
        }
        const dc = data.dc ?? 0;
        if (dc > 0) {
            const skill = getResistingSkill(CONSTS.EFFECT_POISON);
            if (skill && creature.checkSkill(skill, dc)) {
                creature.removeEffect(effect);
                return;
            }
        }
        const amount = creature.dice.roll(data.amp);
        this._dealDamage(data.damageType as DamageType, amount, creature, source);
    }
}
