import { Cooldown, CooldownDefinition, CooldownDefinitionSchema, CooldownSchema } from './Cooldown';

export class CooldownManager {
    create(definition: CooldownDefinition): Cooldown {
        const { duration, charges } = CooldownDefinitionSchema.parse(definition);
        return CooldownSchema.parse({
            timers: [],
            timerMaxCount: charges,
            timerMaxValue: duration,
            active: duration >= 0,
        });
    }

    process(cd: Cooldown) {
        // decrease all timers
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
    pushTimer(cd: Cooldown) {
        if (cd.timers.length >= cd.timerMaxCount) {
            return;
        }
        const duration = cd.timerMaxValue;
        cd.timers.push(duration);
    }
}
