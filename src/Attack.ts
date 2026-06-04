import { Item } from './schemas/Item';
import { DiceRoll } from './DiceRoll';
import { DamageType } from './schemas/enums/DamageType';
import { CONSTS } from './consts';
import { AttackType } from './schemas/enums/AttackType';
import { Creature } from './Creature';
import { CreatureVisibility } from './schemas/enums/CreatureVisibility';
import { generateUniqueId } from './libs/unique-id';
import { isAmmo, isWeapon } from './store/type-guards';
import { Ability } from './schemas/enums/Ability';
import { WeaponBlueprintSchema } from './schemas/WeaponBlueprint';
import NULL_WEAPON_BLUEPRINT from './data/null-weapon.json';
import { ItemBuilder } from './builders/ItemBuilder';
import { aggregate } from './libs/aggregator';

export type Damage = {
    amount: number;
    damageType: DamageType;
};

const NULL_WEAPON: Item = ItemBuilder.buildItem(WeaponBlueprintSchema.parse(NULL_WEAPON_BLUEPRINT));

export class Attack {
    private readonly _id = generateUniqueId();
    public readonly damages: Damage[] = []; // List of dealt damages with amount and type,
    public readonly diceRoll: DiceRoll = new DiceRoll('1d20');
    public targetVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public attackerVisibility: CreatureVisibility = CONSTS.CREATURE_VISIBILITY_VISIBLE; // Target visibility
    public offensiveAbility: Ability = CONSTS.ABILITY_BODY;
    public offensiveAbilityModifier: number = 0;
    public weapon: Item | null = null; // weapons used
    public ammo: Item | null = null; // ammo used
    public attackType: AttackType = CONSTS.ATTACK_TYPE_MELEE; // attack type (ranged, melee)
    public damageType: DamageType = CONSTS.DAMAGE_TYPE_CRUSHING; // damage type used in this attack (useful for hybrid weapons)
    public range: number = 0; // maximum distance of attack (weapons)

    public distance: number = 0; // distance between attacker and target
    public ac: number = 0; // target armor class
    public sneak: boolean = false; // this was a sneak attack : damage will be doubled
    public opportunity: boolean = false; // this was an attack of opportunity
    public rush: boolean = false; // this was a rushed attack
    public improvised: boolean = false; // this was an attack done with an improvised weapons
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

    /** Unique identifier for this attack instance. */
    get id(): string {
        return this._id;
    }

    /** The flat bonus added to the d20 roll when resolving a hit. Proxies `diceRoll.modifier`. */
    set attackBonus(value: number) {
        this.diceRoll.modifier = value;
    }

    /** The flat bonus added to the d20 roll when resolving a hit. Proxies `diceRoll.modifier`. */
    get attackBonus(): number {
        return this.diceRoll.modifier;
    }

    /** The raw d20 result (before modifier). Proxies `diceRoll.roll`. */
    get roll(): number {
        return this.diceRoll.roll;
    }

    /**
     * Resolves the weapons to use for this attack.
     * If `this.weapons` is not a valid weapons, falls back to the NULL_WEAPON (unarmed).
     * Derives `damageType` (from ammo if present, otherwise from the weapons),
     * `attackType` and `range` (melee vs ranged based on weapons attributes),
     * and `finesse` flag.
     * Must be called before `initAbility` and `initTarget`.
     */
    initWeapon() {
        if (!isWeapon(this.weapon)) {
            this.weapon = NULL_WEAPON;
        }
        if (isWeapon(this.weapon)) {
            const weaponAttributes = new Set(this.weapon.attributes);
            if (isAmmo(this.ammo)) {
                this.damageType = this.ammo.damageType;
            } else {
                this.damageType = this.weapon.damageType;
            }
            if (weaponAttributes.has(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
                this.attackType = CONSTS.ATTACK_TYPE_RANGED;
                this.range = 100;
            } else {
                this.attackType = CONSTS.ATTACK_TYPE_MELEE;
                this.range = 5;
            }
            this.finesse = weaponAttributes.has(CONSTS.WEAPON_ATTRIBUTE_FINESSE);
        }
    }

    /**
     * Determines which ability drives the attack roll.
     * For finesse weapons, picks whichever of BODY or SENSES gives the higher modifier.
     * All other weapons always use BODY.
     * Sets `offensiveAbility` and `offensiveAbilityModifier`.
     */
    initAbility() {
        const am = this.attacker.getters.getAbilityModifiers;
        const senses = am[CONSTS.ABILITY_SENSES];
        const body = am[CONSTS.ABILITY_BODY];
        this.offensiveAbility =
            this.finesse && senses >= body ? CONSTS.ABILITY_SENSES : CONSTS.ABILITY_BODY;
        this.offensiveAbilityModifier = am[this.offensiveAbility];
    }

    /**
     * Resolves visibility from each combatant's perspective.
     * A creature that is HIDDEN gets a stealth-vs-perception contest; if the
     * observer wins, the hidden creature is treated as VISIBLE for this attack.
     * The results are stored in `targetVisibility` and `attackerVisibility`
     * and are later used by `computeVisibility` to apply miss-chance penalties.
     */
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

    /**
     * Computes the effective Armor Class the attacker must beat.
     * AC is assembled from the target's base AC plus situational bonuses for:
     * - the attack type (melee / ranged),
     * - the attacker's specie,
     * - the weapons's damage type(s).
     * For hybrid weapons (two damage types), the damage type that the defender
     * resists least is selected, and `this.damageType` is updated accordingly.
     * The final value is stored in `this.ac`.
     */
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
            this.damageType = weaponDamageTypes[0];
        } else {
            // Hybrid weapons: attacker exploits whichever damage type the defender resists least
            const dt1 = ac.damageTypes[weaponDamageTypes[0]] ?? 0;
            const dt2 = ac.damageTypes[weaponDamageTypes[1]] ?? 0;
            if (dt1 <= dt2) {
                this.damageType = weaponDamageTypes[0];
                acBonusDamageType = dt1;
            } else {
                this.damageType = weaponDamageTypes[1];
                acBonusDamageType = dt2;
            }
        }
        this.ac = ac.base + acBonusAttackType + acBonusSpecie + acBonusDamageType;
    }

    /**
     * Runs all four initialisation steps in the required order:
     * visibility → weapons → ability → target AC.
     * Call this once after setting `weapons` and `ammo`, before calling `run`.
     */
    init() {
        this.initVisibility();
        this.initWeapon();
        this.initAbility();
        this.initTarget();
    }

    /**
     * Resolves whether the attack hits.
     * - Roll of 1: automatic fumble (miss), regardless of bonuses.
     * - Roll of 20: automatic critical hit, unless the target is immune to critical hits.
     * - Otherwise: hit when `diceRoll.total` (roll + attack bonus) ≥ `this.ac`.
     * Sets `fumble`, `critical`, and `hit`.
     */
    computeHit() {
        // Fumble: roll of 1 is an automatic miss
        if (this.diceRoll.roll === 1) {
            this.fumble = true;
            this.hit = false;
            return;
        }

        // Critical: roll of 20 is an automatic hit
        if (
            this.diceRoll.roll === 20 &&
            !this.target.getters.getImmunities[CONSTS.IMMUNITY_TYPE_CRITICAL_HIT]
        ) {
            this.critical = true;
            this.hit = true;
        } else {
            this.hit = this.diceRoll.total >= this.ac;
        }
    }

    /**
     * Applies a 50 % miss chance when the target is not fully visible to the attacker
     * while the attacker remains visible to the target (one-sided impairment).
     * If both combatants are impaired, no miss chance applies.
     * Sets `failed` and `failure` when the miss chance triggers.
     */
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

    /**
     * Calculates and stores the total attack bonus in `this.attackBonus`.
     * Composed of: base attack bonus + attack-type bonus + target-specie bonus.
     * For finesse melee attacks, takes the higher of the melee and ranged
     * attack-type bonuses to reward agile fighters.
     */
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

    /**
     * Rolls and records damage for a successful hit.
     * Base damage comes from the weapons's damage formula, with BODY modifier added
     * for melee attacks (doubled when wielding a two-handed weapons).
     * Critical hits double the total damage.
     * The result is pushed into `this.damages` as `{ amount, damageType }`.
     * Throws if called without a valid weapons (which should never happen after `init`).
     */
    computeDamages() {
        const weapon = this.weapon;
        if (isWeapon(weapon)) {
            const damageFormula = weapon.damages;
            const damageType = this.damageType;
            const nExtraDamage = aggregate(
                [CONSTS.PROPERTY_WEAPON_DAMAGE_MODIFIER],
                {},
                this.attacker.getters
            ).sum;
            let amount = this.attacker.dice.roll(damageFormula) + nExtraDamage;
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
            throw new Error('unexpected state : There should be  a weapons here at this stage.');
        }
    }

    /**
     * Applies all entries in `this.damages` to the target.
     * For each damage entry: deducts HP, fires `damaged` on the target and
     * `damage` on the attacker. Sets `this.lethal = true` if the target's
     * HP drops to 0 or below.
     * Call this after `run()`, once you are ready to commit the attack outcome
     * (separating resolution from application lets callers inspect results first).
     */
    applyComputedDamages() {
        for (const { amount, damageType } of this.damages) {
            this.target.hitPoints -= amount;
            this.target.triggerDamagedEvent(amount, damageType, this.attacker);
            this.attacker.triggerDamageEvent(amount, damageType, this.target);
        }
        if (this.target.hitPoints <= 0) {
            this.lethal = true;
        }
    }

    /**
     * Executes the full attack resolution sequence after `init()`.
     * Steps (each may short-circuit the rest):
     * 1. Charm check — a charmed attacker cannot attack its charmer.
     * 2. Visibility miss-chance — 50 % failure if target is not visible to attacker
     *    while attacker is visible to target.
     * 3. Attack bonus — computed from attacker stats, attack type, and target specie.
     * 4. Event hooks — `triggerAttackEvent` on the attacker and `triggerAttackedEvent`
     *    on the target, allowing effects to modify the roll or mark the attack failed.
     * 5. Hit resolution — `computeHit` (fumble / critical / normal).
     * 6. Damage roll — `computeDamages` on a hit.
     * Does NOT apply damage to the target; call `applyComputedDamages` separately.
     */
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
