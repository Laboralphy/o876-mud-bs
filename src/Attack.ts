import { Item } from './schemas/Item';
import { DiceRoll } from './DiceRoll';
import { DamageType } from './schemas/enums/DamageType';
import { CONSTS } from './consts';
import { AttackType } from './schemas/enums/AttackType';
import { Creature } from './Creature';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { generateUniqueId } from './libs/unique-id';

export type Damage = {
    amount: number;
    damageType: DamageType;
};

export class Attack {
    private readonly _id = generateUniqueId();
    public readonly damages: Damage[] = []; // List of dealt damages with amount and type,
    public readonly diceRoll: DiceRoll = new DiceRoll('1d20');
    public weapon: Item | null = null; // weapon used
    public ammo: Item | null = null; // ammo used
    public ac: number = 0; // target armor class
    public distance: number = 0; // distance between attacker and target
    public range: number = 0; // maximum distance of attack (weapon)
    public sneak: boolean = false; // this was a sneak attack : damage will be doubled
    public opportunity: boolean = false; // this was an attack of opportunity
    public rush: boolean = false; // this was a rushed attack
    public improvised: boolean = false; // this was an attack done with an improvised weapon
    public fumble: boolean = false; // roll was 1 : automatic fail
    public finesse: boolean = false; // if true, and attack is melee, it will used best of body, sense
    public critical: boolean = false; // roll was over critical range : automatic hit
    public hit: boolean = false; // if true attack has hit
    public attackType: AttackType = CONSTS.ATTACK_TYPE_MELEE; // attack type (ranged, melee)
    public lethal: boolean = false; // true when the target is killed during the attack
    public failed: boolean = false; // The attack failed
    public failure: string = ''; // reason why attack failed
    public targetVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public attackerVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility

    constructor(
        public readonly attacker: Creature,
        public readonly target: Creature
    ) {
        this.targetVisibility = this.attacker.getCreatureVisibility(this.target);
        this.attackerVisibility = this.target.getCreatureVisibility(this.attacker);
    }

    get id(): string {
        return this._id;
    }

    set attackBonus(value: number) {
        this.diceRoll.modifier = value;
    }

    get attackBonus(): number {
        return this.diceRoll.modifier;
    }

    get roll(): number {
        return this.diceRoll.roll;
    }

    run() {
        if (
            this.targetVisibility !== CONSTS.CREATURE_VISIBILITY_VISIBLE &&
            this.attackerVisibility === CONSTS.CREATURE_VISIBILITY_VISIBLE
        ) {
            // target has 50% chance avoiding attack because of visibility
            // if both creature cannot see target, no maluses apply
            const d = new DiceRoll('1d100', 0, 50);
            if (!d.success) {
                this.failed = true;
                this.failure = CONSTS.ATTACK_FAILURE_VISIBILITY;
            }
        }
    }
}
