import { Cooldown, CooldownDefinition, CooldownDefinitionSchema, CooldownSchema } from './Cooldown';

export class CooldownManager {
    static create(definition: CooldownDefinition): Cooldown {
        const { duration, charges } = CooldownDefinitionSchema.parse(definition);
        return CooldownSchema.parse({
            timers: [],
            timerMaxCount: charges,
            timerMaxValue: duration,
            active: duration >= 0,
        });
    }

    static process(cd: Cooldown) {
        for (let i = 0, l = cd.timers.length; i < l; ++i) {
            --cd.timers[i];
        }
        while (cd.timers.length > 0 && cd.timers[0] <= 0) {
            cd.timers.shift();
        }
    }

    /**
     * Will push a new timer in cooldown timers array, unless the cooldown is full
     * @param cd
     */
    static pushTimer(cd: Cooldown) {
        if (cd.timers.length >= cd.timerMaxCount) {
            return;
        }
        cd.timers.push(cd.timerMaxValue);
    }
}
