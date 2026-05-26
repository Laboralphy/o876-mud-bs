import { IProgram } from '../../interfaces/IProgram';
import { Effect } from '../schemas';
import { Creature } from '../../Creature';
import { CONSTS } from '../../consts';
import { VARS } from '../../vars';
import DISEASES from '../../data/diseases';
import { DamageType } from '../../schemas/enums/DamageType';

const LARGE_DURATION = Number.MAX_SAFE_INTEGER;

export class EffectProgramDisease implements IProgram<Effect> {
    private _stageTag(diseaseTag: string, stageTag: string): string {
        return `${diseaseTag}.${stageTag}`;
    }

    private _removeStageEffects(creature: Creature, tag: string): void {
        // Collect first, then remove — state.effects mutates during removal
        const toRemove = creature.getters.getEffects.filter((e) => e.tag === tag);
        for (const eff of toRemove) {
            creature.removeEffect(eff, true);
        }
    }

    private _dealDamage(
        damageType: DamageType,
        amp: number,
        creature: Creature,
        source: Creature | undefined
    ): void {
        const entry = creature.getters.getDamageMitigation[damageType];
        const reduction = entry?.reduction ?? 0;
        const factor = entry?.factor ?? 1;
        const amount = Math.max(0, Math.floor((amp - reduction) * factor));
        if (amount > 0) {
            creature.hitPoints -= amount;
            creature.triggerDamagedEvent(amount, damageType, source);
        }
    }

    apply(effect: Effect, creature: Creature, source: Creature): void {
        if (effect.type !== CONSTS.EFFECT_DISEASE) {
            return;
        }
        // duration=0 means instant/transient — the effect is not stored in state.effects,
        // so there is nothing to set up.
        if (effect.duration === 0) {
            return;
        }
        const data = effect.data;
        const disease = DISEASES[data.disease];
        if (!disease) {
            return;
        }
        const stage = disease.stages[0];
        data.stage = 0;
        data.timer = 0;
        data.amp = creature.dice.roll(stage.duration) * VARS.DISEASE_STAGE_UNIT_ROUNDS;
        creature.applyEffectGroup(
            stage.conveyedEffects,
            source,
            LARGE_DURATION,
            CONSTS.EFFECT_SUBTYPE_MAGICAL,
            this._stageTag(disease.tag, stage.tag)
        );
    }

    mutate(effect: Effect, creature: Creature, source: Creature | undefined): void {
        if (effect.type !== CONSTS.EFFECT_DISEASE) {
            return;
        }
        const data = effect.data;
        const disease = DISEASES[data.disease];
        if (!disease) {
            return;
        }
        const stage = disease.stages[data.stage];
        ++data.timer;
        if (stage.damages && data.timer % stage.damages.periodicity === 0) {
            const damageAmount = creature.dice.roll(stage.damages.amount);
            this._dealDamage(
                stage.damages.damageType as DamageType,
                damageAmount,
                creature,
                source
            );
        }
        if (data.timer >= data.amp) {
            if (
                stage.resistance &&
                creature.checkSkill(CONSTS.SKILL_SURVIVAL, data.dc ?? disease.dc)
            ) {
                creature.removeEffect(effect, false);
                return;
            }
            const currentStageTag = this._stageTag(disease.tag, stage.tag);
            this._removeStageEffects(creature, currentStageTag);
            const nextStageIndex = data.stage + 1;
            if (nextStageIndex >= disease.stages.length) {
                creature.removeEffect(effect, false);
            } else {
                const nextStage = disease.stages[nextStageIndex];
                data.stage = nextStageIndex;
                data.timer = 0;
                data.amp = creature.dice.roll(nextStage.duration) * VARS.DISEASE_STAGE_UNIT_ROUNDS;
                creature.applyEffectGroup(
                    nextStage.conveyedEffects,
                    source ?? creature,
                    LARGE_DURATION,
                    CONSTS.EFFECT_SUBTYPE_MAGICAL,
                    this._stageTag(disease.tag, nextStage.tag)
                );
            }
        }
    }

    dispose(effect: Effect, creature: Creature, _source: Creature | undefined): void {
        if (effect.type !== CONSTS.EFFECT_DISEASE) {
            return;
        }
        const data = effect.data;
        const disease = DISEASES[data.disease];
        if (!disease) {
            return;
        }
        const stage = disease.stages[data.stage];
        this._removeStageEffects(creature, this._stageTag(disease.tag, stage.tag));
    }
}
