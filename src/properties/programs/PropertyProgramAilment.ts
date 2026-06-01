import { z } from 'zod';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertyAilment } from '../schemas/modifiers/ailment';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';
import { EffectSubtype } from '../../schemas/enums/EffectSubtype';
import { Creature } from '../../Creature';
import { DamageType } from '../../schemas/enums/DamageType';
import { EffectType } from '../../schemas/enums/EffectType';
import { getResistingSkill } from '../../libs/get-resisting-skill';
import { Skill } from '../../schemas/enums/Skill';

type TPropertyAilment = z.infer<typeof PropertyAilment>;

const SUBTYPE_ABILITY: Partial<Record<EffectSubtype, Ability>> = {
    [CONSTS.EFFECT_SUBTYPE_SUPERNATURAL]: CONSTS.ABILITY_PRESENCE,
    [CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY]: CONSTS.ABILITY_BODY,
    [CONSTS.EFFECT_SUBTYPE_MAGICAL]: CONSTS.ABILITY_MIND,
    [CONSTS.EFFECT_SUBTYPE_WEAPON]: CONSTS.ABILITY_SENSES,
};

export class PropertyProgramAilment implements IProgram<Property> {
    damage(
        prop: Property,
        _amount: number,
        _damageType: DamageType,
        creature: Creature,
        target: Creature
    ): void {
        const data = prop.data as TPropertyAilment;

        if (creature.dice.roll('1d20') > data.chance) {
            return;
        }

        // UNYIELDING effects bypass resistance checks
        const resistAbility = () => {
            const ra = SUBTYPE_ABILITY[data.subtype];
            if (ra !== undefined && target.checkResistance(ra, data.dc)) {
                return true;
            }
            return false;
        };

        const resistSkill = (effectType: EffectType) => {
            const rs: Skill | null = getResistingSkill(effectType);
            return !!(rs && target.checkSkill(rs, data.dc));
        };

        switch (data.ailmentType) {
            case CONSTS.AILMENT_ABILITY_DRAIN:
                target.applyEffect(
                    {
                        type: CONSTS.EFFECT_ABILITY_MODIFIER,
                        amp: -creature.dice.roll(data.amp!),
                        ability: data.ability!,
                    },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_ATTACK_DRAIN:
                target.applyEffect(
                    { type: CONSTS.EFFECT_ATTACK_MODIFIER, amp: -creature.dice.roll(data.amp!) },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_ARMOR_CLASS_DRAIN:
                target.applyEffect(
                    {
                        type: CONSTS.EFFECT_ARMOR_CLASS_MODIFIER,
                        amp: -creature.dice.roll(data.amp!),
                    },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_DISEASE: {
                const alreadyInfected = target.state.effects.some(
                    (e) =>
                        e.type === CONSTS.EFFECT_DISEASE &&
                        (e.data as { disease: string }).disease === data.disease
                );
                if (!alreadyInfected) {
                    target.applyEffect(
                        {
                            type: CONSTS.EFFECT_DISEASE,
                            disease: data.disease!,
                            amp: 0,
                            stage: 0,
                            timer: 0,
                        },
                        creature,
                        data.duration,
                        data.subtype
                    );
                }
                break;
            }

            case CONSTS.AILMENT_BLINDNESS:
                target.applyEffect(
                    { type: CONSTS.EFFECT_BLINDNESS },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_FEAR:
                target.applyEffect(
                    { type: CONSTS.EFFECT_FEAR, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_POISON:
                target.applyEffect(
                    {
                        type: CONSTS.EFFECT_POISON,
                        amp: data.amp as string,
                        damageType: data.damageType ?? CONSTS.DAMAGE_TYPE_NECROTIC,
                        dc: data.dc,
                        periodicity: 1,
                        timer: 0,
                    },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_PARALYSIS:
                target.applyEffect(
                    { type: CONSTS.EFFECT_PARALYSIS, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_PETRIFICATION:
                target.applyEffect(
                    { type: CONSTS.EFFECT_PETRIFICATION, amp: 1, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_STUN:
                target.applyEffect(
                    { type: CONSTS.EFFECT_STUN, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;

            case CONSTS.AILMENT_ROOT:
                target.applyEffect(
                    { type: CONSTS.EFFECT_ROOT, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
        }
    }
}
