import { IProgram } from '../../interfaces/IProgram';
import { Property } from '../schemas';
import { Creature } from '../../Creature';
import { Attack } from '../../Attack';
import { DamageType } from '../../schemas/enums/DamageType';
import { z } from 'zod';
import { PropertyThink } from '../schemas/think/think';

type ThinkData = z.infer<typeof PropertyThink>;

export class PropertyProgramThink implements IProgram<Property> {
    mutate(prop: Property, creature: Creature): void {
        const { mutate: scriptId } = prop.data as ThinkData;
        if (scriptId) {
            creature.rules.invokeThinker(scriptId, creature, undefined);
        }
    }

    attack(prop: Property, attack: Attack): void {
        const { attack: scriptId } = prop.data as ThinkData;
        if (scriptId) {
            attack.attacker.rules.invokeThinker(scriptId, attack.attacker, attack.target);
        }
    }

    attacked(prop: Property, attack: Attack): void {
        const { attacked: scriptId } = prop.data as ThinkData;
        if (scriptId) {
            attack.target.rules.invokeThinker(scriptId, attack.target, attack.attacker);
        }
    }

    damage(
        prop: Property,
        _amount: number,
        _damageType: DamageType,
        creature: Creature,
        target: Creature
    ): void {
        const { damage: scriptId } = prop.data as ThinkData;
        if (scriptId) {
            creature.rules.invokeThinker(scriptId, creature, target);
        }
    }

    damaged(
        prop: Property,
        _amount: number,
        _damageType: DamageType,
        creature: Creature,
        source: Creature | undefined
    ): void {
        const { damaged: scriptId } = prop.data as ThinkData;
        if (scriptId) {
            creature.rules.invokeThinker(scriptId, creature, source);
        }
    }
}
