import { z } from 'zod';
import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { PropertyAilment } from '../schemas/status/ailment';
import { CONSTS } from '../../consts';
import { Ability } from '../../schemas/enums/Ability';
import { EffectSubtype } from '../../schemas/enums/EffectSubtype';
import { Creature } from '../../Creature';
import { DamageType } from '../../schemas/enums/DamageType';
import { Threat } from '../../schemas/enums/Threat';

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

        const isUnyielding = data.subtype === CONSTS.EFFECT_SUBTYPE_UNYIELDING;

        // Drains resist via a subtype-based ability check (no fixed threat type yet)
        const resistDrain = () => {
            if (isUnyielding) {
                return false;
            }
            const ra = SUBTYPE_ABILITY[data.subtype];
            return ra !== undefined && target.rollAbilityCheck(ra, data.dc);
        };

        const resist = (threat: Threat) => !isUnyielding && target.checkResistance(threat, data.dc);

        switch (data.ailment) {
            case CONSTS.AILMENT_ABILITY_DRAIN: {
                if (resistDrain()) {
                    return;
                }
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
            }

            case CONSTS.AILMENT_ATTACK_DRAIN: {
                if (resistDrain()) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_ATTACK_MODIFIER, amp: -creature.dice.roll(data.amp!) },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_ARMOR_CLASS_DRAIN: {
                if (resistDrain()) {
                    return;
                }
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
            }

            case CONSTS.AILMENT_DISEASE: {
                if (resist(CONSTS.THREAT_DISEASE)) {
                    return;
                }
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
                        Number.MAX_SAFE_INTEGER,
                        data.subtype
                    );
                }
                break;
            }

            case CONSTS.AILMENT_BLINDNESS: {
                if (resist(CONSTS.THREAT_BLINDNESS)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_BLINDNESS },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_FEAR: {
                if (resist(CONSTS.THREAT_FEAR)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_FEAR, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_POISON: {
                if (resist(CONSTS.THREAT_POISON)) {
                    return;
                }
                target.applyEffect(
                    {
                        type: CONSTS.EFFECT_POISON,
                        amp: String(data.amp),
                        damageType: CONSTS.DAMAGE_TYPE_NECROTIC,
                        dc: data.dc,
                        periodicity: 1,
                        timer: 0,
                    },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_PARALYSIS: {
                if (resist(CONSTS.THREAT_PARALYSIS)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_PARALYSIS, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_PETRIFICATION: {
                if (resist(CONSTS.THREAT_PETRIFY)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_PETRIFICATION, amp: 1, dc: data.dc },
                    creature,
                    Number.MAX_SAFE_INTEGER,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_STUN: {
                if (resist(CONSTS.THREAT_STUN)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_STUN, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            case CONSTS.AILMENT_ROOT: {
                if (resist(CONSTS.THREAT_BLAST)) {
                    return;
                }
                target.applyEffect(
                    { type: CONSTS.EFFECT_ROOT, dc: data.dc },
                    creature,
                    data.duration,
                    data.subtype
                );
                break;
            }

            default: {
                throw new ReferenceError(`Ailment ${data.ailment} unknown`);
            }
        }
    }
}
