import { State } from '../state';
import { Environment, EnvironmentSchema } from '../../schemas/enums/Environment';

export function getEnvironments(state: State): Set<Environment> {
    const e = new Set<Environment>();
    for (const [env, b] of Object.entries(state.environments)) {
        if (b) {
            e.add(EnvironmentSchema.parse(env));
        }
    }
    return e;
}
