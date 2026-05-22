import { State } from '../state';
import { GetterReturnType } from '../define-getters';
import { CONSTS } from '../../consts';
import { aggregate } from '../../libs/aggregator';
import { DamageType } from '../../schemas/enums/DamageType';
import { VARS } from '../../vars';

export type DamageMitigationEntry = {
    reduction: number;
    factor: number;
    resistance: boolean;
    vulnerability: boolean;
    immunity: boolean;
};

const dtDiscriminator = {
    effects: { discriminator: (e: { data: { damageType?: string } }) => e.data.damageType ?? '' },
    properties: { discriminator: (p: { data: { damageType?: string } }) => p.data.damageType ?? '' },
};

export function getDamageMitigation(
    state: State,
    getters: GetterReturnType
): Map<DamageType, DamageMitigationEntry> {
    const oReduction = aggregate(
        [CONSTS.EFFECT_DAMAGE_REDUCTION, CONSTS.PROPERTY_DAMAGE_REDUCTION],
        dtDiscriminator,
        getters
    );
    const oResistance = aggregate(
        [CONSTS.EFFECT_DAMAGE_RESISTANCE, CONSTS.PROPERTY_DAMAGE_RESISTANCE],
        dtDiscriminator,
        getters
    );
    const oVulnerability = aggregate(
        [CONSTS.EFFECT_DAMAGE_VULNERABILITY, CONSTS.PROPERTY_DAMAGE_VULNERABILITY],
        dtDiscriminator,
        getters
    );
    const oImmunity = aggregate(
        [CONSTS.EFFECT_DAMAGE_IMMUNITY, CONSTS.PROPERTY_DAMAGE_IMMUNITY],
        dtDiscriminator,
        getters
    );

    const allDamageTypes = new Set([
        ...Object.keys(oReduction.discriminator),
        ...Object.keys(oResistance.discriminator),
        ...Object.keys(oVulnerability.discriminator),
        ...Object.keys(oImmunity.discriminator),
    ]);

    const result = new Map<DamageType, DamageMitigationEntry>();

    for (const dt of allDamageTypes) {
        const immunity = (oImmunity.discriminator[dt]?.count ?? 0) > 0;
        const resistance = (oResistance.discriminator[dt]?.count ?? 0) > 0;
        const vulnerability = (oVulnerability.discriminator[dt]?.count ?? 0) > 0;
        const i = immunity ? 'i' : '';
        const r = resistance ? 'r' : '';
        const v = vulnerability ? 'v' : '';
        let factor = 1;
        switch (i + r + v) {
            case 'i':
            case 'ir':
            case 'iv':
            case 'irv':
                factor = VARS.DAMAGE_FACTOR_IMMUNITY;
                break;
            case 'r':
                factor = VARS.DAMAGE_FACTOR_RESISTANCE;
                break;
            case 'v':
                factor = VARS.DAMAGE_FACTOR_VULNERABILITY;
                break;
        }
        result.set(dt as DamageType, {
            reduction: oReduction.discriminator[dt]?.sum ?? 0,
            factor,
            resistance,
            vulnerability,
            immunity,
        });
    }

    return result;
}
