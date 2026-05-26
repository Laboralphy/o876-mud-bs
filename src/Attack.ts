import { Item } from './schemas/Item';
import { DiceRoll } from './DiceRoll';
import { DamageType } from './schemas/enums/DamageType';
import { CONSTS } from './consts';
import { AttackType } from './schemas/enums/AttackType';
import { Creature } from './Creature';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { generateUniqueId } from './libs/unique-id';
import { isWeapon } from './store/type-guards';
import { Ability } from './schemas/enums/Ability';
import { WeaponBlueprintSchema } from './schemas/WeaponBlueprint';
import NULL_WEAPON_BLUEPRINT from './data/null-weapon.json';
import { ItemBuilder } from './builders/ItemBuilder';

export type Damage = {
    amount: number;
    damageType: DamageType;
};

const NULL_WEAPON = ItemBuilder.buildItem(WeaponBlueprintSchema.parse(NULL_WEAPON_BLUEPRINT));

export class Attack {
    private readonly _id = generateUniqueId();
    public readonly damages: Damage[] = []; // List of dealt damages with amount and type,
    public readonly diceRoll: DiceRoll = new DiceRoll('1d20');
    public targetVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public attackerVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public offensiveAbility: Ability = CONSTS.ABILITY_BODY;
    public offensiveAbilityModifier: number = 0;
    public weapon: Item | null = null; // weapon used
    public ammo: Item | null = null; // ammo used
    public attackType: AttackType = CONSTS.ATTACK_TYPE_MELEE; // attack type (ranged, melee)
    public range: number = 0; // maximum distance of attack (weapon)

    public distance: number = 0; // distance between attacker and target
    public ac: number = 0; // target armor class
    public sneak: boolean = false; // this was a sneak attack : damage will be doubled
    public opportunity: boolean = false; // this was an attack of opportunity
    public rush: boolean = false; // this was a rushed attack
    public improvised: boolean = false; // this was an attack done with an improvised weapon
    public fumble: boolean = false; // roll was 1 : automatic fail
    public finesse: boolean = false; // if true, and attack is melee, it will used best of body, sense
    public critical: boolean = false; // roll was over critical range : automatic hit
    public hit: boolean = false; // if true attack has hit
    public lethal: boolean = false; // true when the target is killed during the attack
    public failed: boolean = false; // The attack failed
    public failure: string = ''; // reason why attack failed

    constructor(
        public readonly attacker: Creature,
        public readonly target: Creature
    ) {}

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

    initWeapon() {
        const weaponAttributes = this.attacker.getters.getSelectedWeaponAttributeSet;
        this.weapon = this.attacker.getters.getSelectedWeapon ?? NULL_WEAPON;
        this.ammo = this.attacker.getters.getSelectedWeaponAmmo;
        if (weaponAttributes.has(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
            this.attackType = CONSTS.ATTACK_TYPE_RANGED;
            this.range = 100;
        } else {
            this.attackType = CONSTS.ATTACK_TYPE_MELEE;
            this.range = 5;
        }
        if (this.weapon) {
            this.finesse = weaponAttributes.has(CONSTS.WEAPON_ATTRIBUTE_FINESSE);
        }
    }

    initAbility() {
        const am = this.attacker.getters.getAbilityModifiers;
        const senses = am[CONSTS.ABILITY_SENSES];
        const body = am[CONSTS.ABILITY_BODY];
        this.offensiveAbility =
            this.finesse && senses >= body ? CONSTS.ABILITY_SENSES : CONSTS.ABILITY_BODY;
        this.offensiveAbilityModifier = am[this.offensiveAbility];
    }

    initVisibility() {
        this.targetVisibility = this.attacker.getCreatureVisibility(this.target);
        this.attackerVisibility = this.target.getCreatureVisibility(this.attacker);
        if (this.targetVisibility === CONSTS.CREATURE_VISIBILITY_HIDDEN) {
            if (
                !this.attacker.checkSkillAgainst(
                    CONSTS.SKILL_STEALTH,
                    this.target,
                    CONSTS.SKILL_PERCEPTION
                )
            ) {
                this.targetVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE;
            }
        }
        if (this.attackerVisibility === CONSTS.CREATURE_VISIBILITY_HIDDEN) {
            if (
                !this.target.checkSkillAgainst(
                    CONSTS.SKILL_STEALTH,
                    this.attacker,
                    CONSTS.SKILL_PERCEPTION
                )
            ) {
                this.attackerVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE;
            }
        }
    }

    initTarget() {
        const ac = this.target.getters.getArmorClass;
        const specie = this.target.getters.getSpecie;
        const weapon = this.weapon;
        const weaponDamageTypes: DamageType[] = [];
        if (isWeapon(weapon)) {
            weaponDamageTypes.push(weapon.damageType);
            if (weapon.altDamageType) {
                weaponDamageTypes.push(weapon.altDamageType);
            }
        } else {
            weaponDamageTypes.push(CONSTS.DAMAGE_TYPE_CRUSHING);
        }
        const acBonusAttackType: number = ac.attackTypes[this.attackType] ?? 0;
        const acBonusSpecie: number = ac.species[specie] ?? 0;
        let acBonusDamageType: number;
        if (weaponDamageTypes.length === 1) {
            acBonusDamageType = ac.damageTypes[weaponDamageTypes[0]] ?? 0;
        } else {
            // Hybrid weapon: attacker exploits whichever damage type the defender resists least
            const dt1 = ac.damageTypes[weaponDamageTypes[0]] ?? 0;
            const dt2 = ac.damageTypes[weaponDamageTypes[1]] ?? 0;
            acBonusDamageType = Math.min(dt1, dt2);
        }
        this.ac = ac.base + acBonusAttackType + acBonusSpecie + acBonusDamageType;
    }

    init() {
        this.initVisibility();
        this.initWeapon();
        this.initAbility();
        this.initTarget();
    }

    computeHit() {
        // Fumble: roll of 1 is an automatic miss
        if (this.diceRoll.roll === 1) {
            this.fumble = true;
            this.hit = false;
            return;
        }

        // Critical: roll of 20 is an automatic hit
        if (this.diceRoll.roll === 20) {
            this.critical = true;
            this.hit = true;
        } else {
            this.hit = this.diceRoll.total >= this.ac;
        }
    }

    computeVisibility() {
        if (
            this.targetVisibility !== CONSTS.CREATURE_VISIBILITY_VISIBLE &&
            this.attackerVisibility === CONSTS.CREATURE_VISIBILITY_VISIBLE
        ) {
            const d = new DiceRoll('1d100', 0, 50);
            if (!d.success) {
                this.failed = true;
                this.failure = CONSTS.ATTACK_FAILURE_VISIBILITY;
            }
        }
    }

    computeAttackBonus() {
        const ab = this.attacker.getters.getAttackBonus;
        const targetSpecie = this.target.getters.getSpecie;
        let typeBonus: number;
        if (this.finesse && this.attackType === CONSTS.ATTACK_TYPE_MELEE) {
            typeBonus = Math.max(
                ab.attackTypes[CONSTS.ATTACK_TYPE_MELEE] ?? 0,
                ab.attackTypes[CONSTS.ATTACK_TYPE_RANGED] ?? 0
            );
        } else {
            typeBonus = ab.attackTypes[this.attackType] ?? 0;
        }
        this.attackBonus = ab.base + typeBonus + (ab.species[targetSpecie] ?? 0);
    }

    computeDamages() {
        const weapon = this.weapon;
        if (isWeapon(weapon)) {
            const damageFormula = weapon.damages;
            const damageType = weapon.damageType;
            let amount = this.attacker.dice.roll(damageFormula);
            if (this.attackType === CONSTS.ATTACK_TYPE_MELEE) {
                amount += this.attacker.getters.getAbilityModifiers[CONSTS.ABILITY_BODY];
                if (this.attacker.getters.isWieldingTwoHandedWeapon) {
                    amount += this.attacker.getters.getAbilityModifiers[CONSTS.ABILITY_BODY];
                }
            }
            if (this.critical) {
                amount *= 2;
            }
            this.damages.push({ amount, damageType });
        } else {
            throw new Error('unexpected state : There should be  a weapon here at this stage.');
        }
    }

    run() {
        // Charmed attacker cannot attack its charmer
        if (this.attacker.getters.getCharmerSet.has(this.target.id)) {
            this.failed = true;
            this.failure = CONSTS.ATTACK_FAILURE_CHARMED;
            return;
        }

        // Visibility miss: target has 50% chance to avoid if only the attacker is impaired.
        // If both are impaired, no miss chance applies.
        this.computeVisibility();
        if (this.failed) {
            return;
        }

        // Compute attack bonus: base + attack-type bonus (with finesse support) + specie bonus
        this.computeAttackBonus();

        // Let properties and effects on both sides modify the attack before resolution
        this.attacker.triggerAttackEvent(this);
        this.target.triggerAttackedEvent(this);

        this.computeHit();

        // Roll damages on a hit
        if (this.hit) {
            this.computeDamages();
        }
    }
}
