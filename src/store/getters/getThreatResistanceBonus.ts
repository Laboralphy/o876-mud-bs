import { State } from '../state';
import { CONSTS } from '../../consts';
import { ThreatType } from '../../schemas/enums/ThreatType';
import { aggregate } from '../../libs/aggregator';
import { GetterReturnType } from '../define-getters';
import { Effect } from '../../effects/schemas';
import { Property } from '../../properties/schemas';

export const getThreatResistanceBonus = (
    state: State,
    getters: GetterReturnType
): Record<ThreatType, number> => {
    const result = aggregate(
        [CONSTS.PROPERTY_RESIST_THREAT, CONSTS.EFFECT_RESIST_THREAT],
        {
            effects: {
                discriminator: (pe: Effect) =>
                    pe.type === CONSTS.EFFECT_RESIST_THREAT ? pe.data.threatType : '',
            },
            properties: {
                discriminator: (pe: Property) =>
                    pe.type === CONSTS.PROPERTY_RESIST_THREAT ? pe.data.threatType : '',
            },
        },
        getters
    );
    return {
        [CONSTS.THREAT_TYPE_BODY_DECAY]:
            result.discriminator[CONSTS.THREAT_TYPE_BODY_DECAY]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_CHARM]: result.discriminator[CONSTS.THREAT_TYPE_CHARM]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_DISEASE]: result.discriminator[CONSTS.THREAT_TYPE_DISEASE]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_FEAR]: result.discriminator[CONSTS.THREAT_TYPE_FEAR]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_PARALYSIS]:
            result.discriminator[CONSTS.THREAT_TYPE_PARALYSIS]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_PETRIFICATION]:
            result.discriminator[CONSTS.THREAT_TYPE_PETRIFICATION]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_POISON]: result.discriminator[CONSTS.THREAT_TYPE_POISON]?.sum ?? 0,
        [CONSTS.THREAT_TYPE_SPELL]: result.discriminator[CONSTS.THREAT_TYPE_SPELL]?.sum ?? 0,
    };
};
