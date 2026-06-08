import type { Creature } from '../../Creature';
import { Effect, EffectDefinition, EffectSchema } from '../../effects/schemas';
import { EffectSubtype } from '../../schemas/enums/EffectSubtype';
import { CONSTS } from '../../consts';
import { effectPrograms } from '../../effects/programs';
import { getImmunityRules } from '../get-immunity-rules';
import { EventEffectProcessorImmunity } from '../../schemas/events/EventEffectProcessorImmunity';
import { EventEffectProcessorCreatureEffect } from '../../schemas/events/EventEffectProcessorCreatureEffect';
import { randomUUID } from 'node:crypto';

export class EffectContainer {
    private readonly creature: Creature;

    constructor(creature: Creature) {
        this.creature = creature;
    }

    private get effects(): Effect[] {
        return this.creature.state.effects;
    }

    findById(idEffect: string): Effect | undefined {
        const i = this.effects.findIndex((e) => e.id === idEffect);
        return i >= 0 ? this.effects[i] : undefined;
    }

    apply(
        effectDefinition: EffectDefinition,
        source: Creature | null = null,
        duration: number = 0,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect {
        const effectSource = source ?? this.creature;
        const effect: Effect = EffectSchema.parse({
            type: effectDefinition.type,
            data: effectDefinition,
            id: randomUUID(),
            source: effectSource.id,
            target: this.creature.id,
            duration,
            subtype,
            tag,
            siblings: [],
        });
        let immune: boolean = getImmunityRules(effect, this.creature.getters.getImmunities);
        this.creature.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, {
            creature: this.creature,
            effect,
            immune: (b: boolean) => {
                immune = b;
            },
        });
        if (!immune) {
            if (duration > 0) {
                this.effects.push(effect);
            }
            this.creature.emit<EventEffectProcessorCreatureEffect>(
                CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                { creature: this.creature, effect }
            );
            const prog = effectPrograms.get(effect.type);
            if (prog?.apply) {
                prog.apply(effect, this.creature, effectSource);
            }
        }
        return effect;
    }

    applyGroup(
        effectDefinitions: EffectDefinition[],
        source: Creature,
        duration: number,
        subtype: EffectSubtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
        tag: string = ''
    ): Effect[] {
        const aEffectIds: string[] = [];
        const aEffects: Effect[] = [];
        for (const effectDefinition of effectDefinitions) {
            const effect: Effect = EffectSchema.parse({
                type: effectDefinition.type,
                data: effectDefinition,
                id: randomUUID(),
                source: source.id,
                target: this.creature.id,
                duration: duration < 0 ? Infinity : duration,
                subtype,
                tag,
                siblings: aEffectIds,
            });
            let immune = false;
            this.creature.emit<EventEffectProcessorImmunity>(CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_IMMUNITY, {
                creature: this.creature,
                effect,
                immune: () => {
                    immune = true;
                },
            });
            if (!immune && effect.duration > 0) {
                aEffectIds.push(effect.id);
                aEffects.push(effect);
                this.effects.push(effect);
                this.creature.emit<EventEffectProcessorCreatureEffect>(
                    CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_APPLIED,
                    { creature: this.creature, effect }
                );
            }
        }
        return aEffects;
    }

    remove(effect: Effect, bIgnoreSiblings: boolean = false) {
        const effIndex = this.effects.findIndex((e) => e.id === effect.id);
        if (effIndex < 0) {
            return;
        }
        const found = this.effects[effIndex];
        if (!bIgnoreSiblings) {
            found.siblings.forEach((siblingId: string) => {
                const sibling = this.findById(siblingId);
                if (sibling) {
                    this.remove(sibling, true);
                }
            });
            this.remove(found, true);
            return;
        }
        const source = this.creature.registry?.getCreature(effect.source);
        this.creature.emit<EventEffectProcessorCreatureEffect>(
            CONSTS.EVENT_EFFECT_PROCESSOR_EFFECT_DISPOSED,
            { creature: this.creature, effect: found }
        );
        const prog = effectPrograms.get(found.type);
        if (prog?.dispose) {
            prog.dispose(found, this.creature, source);
        }
        this.effects.splice(effIndex, 1);
    }

    setDuration(effect: Effect, duration: number) {
        const found = this.findById(effect.id);
        if (found) {
            found.duration = duration;
        }
    }

    dispel(effect: Effect) {
        this.setDuration(effect, 0);
    }

    removeDeadEffects() {
        let i = this.effects.length - 1;
        while (i >= 0) {
            if (this.effects[i].duration <= 0) {
                this.remove(this.effects[i], true);
            }
            --i;
        }
    }

    deplete() {
        for (const effect of this.effects) {
            --effect.duration;
        }
        this.removeDeadEffects();
    }
}
