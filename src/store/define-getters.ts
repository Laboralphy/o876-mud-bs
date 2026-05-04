import { GetterOutput } from '@laboralphy/reactor';
import { getAbilityBaseValues } from './getters/getAbilityBaseValues';
export type GetterReturnFunctions = {
    getAbilityBaseValues: typeof getAbilityBaseValues;
};

export type GetterReturnType = GetterOutput<GetterReturnFunctions>;
export const Getters = {
    getAbilityBaseValues,
};
