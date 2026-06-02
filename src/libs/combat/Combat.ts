import { Creature } from '../../Creature';
import { DistanceComputer } from '../distance';
import { Distance } from '../../schemas/enums/Distance';
import { Item } from '../../schemas/Item';
import { CONSTS } from '../../consts';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { isAmmo, isWeapon } from '../../store/type-guards';
import { ActionState } from '../../schemas/Action';
import EventEmitter from 'node:events';
import { Attack } from '../../Attack';
import { EventCombatActionFailure } from '../../schemas/events/EventCombatActionFailure';

type SlotWeaponAmmo = {
    slot: EquipmentSlot;
    weapon: Item;
    ammo?: Item;
};

type QueuedAction = {
    actionId: string;
    target: Creature | undefined;
};

/**
 * The combat class
 */
export class Combat {
    private distance: Distance = CONSTS.DISTANCE_FAR;
    public readonly events = new EventEmitter();
    public busy: boolean = false; // if true then the next attack will be skipped
    private _pendingNormalAction: QueuedAction | null = null;
    private _pendingBonusAction: QueuedAction | null = null;
    private _internalTimer: number = 0;

    constructor(
        public readonly attacker: Creature,
        public readonly target: Creature
    ) {}

    /**
     * Returns all ready hostile actions whose range meets or exceeds `minDistance`.
     * "Ready" is determined by the creature's `getActions` getter, which already accounts
     * for cooldowns, charges, and the `actionTaken`/`bonusActionTaken` round flags —
     * so this list automatically reflects what is still usable at any point in the round.
     */
    getOffensiveActionList(minDistance: Distance): ActionState[] {
        const readyIds = new Set(
            this.attacker.getters.getActions.filter((a) => a.ready).map((a) => a.id)
        );
        return Object.values(this.attacker.state.actions).filter(
            (action) =>
                action.hostile &&
                DistanceComputer.compare(action.range, minDistance) >= 0 &&
                readyIds.has(action.id)
        );
    }

    /**
     * Returns ready hostile normal (non-bonus) actions usable at the current distance.
     * This list is empty once `actionTaken` is true for this round.
     */
    private getNormalOffensiveActionList(): ActionState[] {
        return this.getOffensiveActionList(this.distance).filter((a) => !a.bonus);
    }

    /**
     * Returns ready hostile bonus actions usable at the current distance.
     * This list is empty once `bonusActionTaken` is true for this round.
     */
    private getBonusOffensiveActionList(): ActionState[] {
        return this.getOffensiveActionList(this.distance).filter((a) => a.bonus);
    }

    /**
     * Returns all ranged weapons the attacker currently has ready to fire.
     * - The dedicated ranged slot (`EQUIPMENT_SLOT_WEAPON_RANGED`) is included only when
     *   its ammo requirement is satisfied (matching ammo type in `EQUIPMENT_SLOT_AMMO`),
     *   or when the weapons has no ammo requirement at all.
     * - Natural weapons slots are also checked: a natural weapons with the `RANGED` attribute
     *   (e.g. spit, sting) is included without any ammo check.
     */
    getRangedWeaponList(): SlotWeaponAmmo[] {
        const eq = this.attacker.state.equipment;
        const result: SlotWeaponAmmo[] = [];

        // Dedicated ranged slot — respect ammo requirement if present
        const rangedWeapon = eq[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED];
        if (isWeapon(rangedWeapon)) {
            if (rangedWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_AMMUNITION)) {
                const ammo = eq[CONSTS.EQUIPMENT_SLOT_AMMO];
                if (isAmmo(ammo) && ammo.ammoType === rangedWeapon.ammoType) {
                    result.push({
                        slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
                        weapon: rangedWeapon,
                        ammo,
                    });
                }
            } else {
                result.push({ slot: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED, weapon: rangedWeapon });
            }
        }

        // Natural slots can also hold ranged weapons (spit, sting, etc.) — no ammo needed
        const naturalSlots: EquipmentSlot[] = [
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3,
        ];
        for (const slot of naturalSlots) {
            const w = eq[slot];
            if (isWeapon(w) && w.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
                result.push({ slot, weapon: w });
            }
        }
        return result;
    }

    /**
     * Returns all melee weapons the attacker has equipped.
     * Checks the dedicated melee slot and all three natural weapons slots.
     * A natural weapons that carries the `RANGED` attribute is excluded — it is
     * handled by `getRangedWeaponList` instead.
     */
    getMeleeWeaponList(): SlotWeaponAmmo[] {
        const eq = this.attacker.state.equipment;
        const meleeSlots: EquipmentSlot[] = [
            CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3,
        ];
        return meleeSlots.reduce<SlotWeaponAmmo[]>((acc, slot) => {
            const w = eq[slot];
            if (isWeapon(w) && !w.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
                acc.push({ slot, weapon: w });
            }
            return acc;
        }, []);
    }

    /**
     * Returns secondary and tertiary melee natural weapons the attacker has equipped.
     * These weapon may be used for bonus actions
     */
    getAltNaturalMeleeWeaponList(): SlotWeaponAmmo[] {
        const eq = this.attacker.state.equipment;
        const meleeSlots: EquipmentSlot[] = [
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
            CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3,
        ];
        return meleeSlots.reduce<SlotWeaponAmmo[]>((acc, slot) => {
            const w = eq[slot];
            if (isWeapon(w) && !w.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
                acc.push({ slot, weapon: w });
            }
            return acc;
        }, []);
    }

    /**
     * Returns the weapons list appropriate for the current distance.
     * - `FAR` / `MEDIUM` → ranged weapons only.
     * - `CLOSE` → melee weapons only.
     * An empty list means the attacker has nothing usable at this range; `playRound`
     * will respond by trying to close the distance.
     */
    getSuitableWeaponList(): SlotWeaponAmmo[] {
        switch (this.distance) {
            case CONSTS.DISTANCE_FAR:
            case CONSTS.DISTANCE_MEDIUM: {
                return this.getRangedWeaponList();
            }
            case CONSTS.DISTANCE_CLOSE: {
                return this.getMeleeWeaponList();
            }
            default: {
                throw new Error('Invalid distance');
            }
        }
    }

    /**
     * Sets the current distance between the attacker and its target.
     * Unless `bQuiet` is true, emits a `distance-changed` event so that the
     * `CombatManager` can mirror the new distance to the opposing combat instance.
     */
    setDistance(d: Distance, bQuiet: boolean = false) {
        this.distance = d;
        if (!bQuiet) {
            this.events.emit('distance-changed', { distance: d });
        }
    }

    /**
     * Returns the current distance between attacker and target.
     */
    getDistance(): Distance {
        return this.distance;
    }

    /**
     * Moves one step closer to the target: FAR → MEDIUM → CLOSE.
     * Has no effect when already at CLOSE range.
     */
    approach() {
        switch (this.distance) {
            case CONSTS.DISTANCE_FAR: {
                this.setDistance(CONSTS.DISTANCE_MEDIUM);
                break;
            }
            case CONSTS.DISTANCE_MEDIUM: {
                this.setDistance(CONSTS.DISTANCE_CLOSE);
                break;
            }
            case CONSTS.DISTANCE_CLOSE: {
                break;
            }
            default: {
                throw new TypeError('Invalid distance');
            }
        }
    }

    /**
     * Moves one step away from the target: CLOSE → MEDIUM → FAR.
     * Has no effect when already at FAR range.
     */
    retreat() {
        switch (this.distance) {
            case CONSTS.DISTANCE_FAR: {
                break;
            }
            case CONSTS.DISTANCE_MEDIUM: {
                this.setDistance(CONSTS.DISTANCE_FAR);
                break;
            }
            case CONSTS.DISTANCE_CLOSE: {
                this.setDistance(CONSTS.DISTANCE_MEDIUM);
                break;
            }
            default: {
                throw new TypeError('Invalid distance');
            }
        }
    }

    private runAttack(swa: SlotWeaponAmmo) {
        this.attacker.state.selectedOffensiveSlot = swa.slot;
        const attack = new Attack(this.attacker, this.target);
        attack.weapon = swa.weapon;
        attack.ammo = swa.ammo ?? null;
        attack.init();
        attack.run();
        attack.applyComputedDamages();
    }

    /**
     * Executes a single weapons attack as the attacker's normal action.
     * Marks `actionTaken` on the creature so no second normal action can be taken
     * this round, then runs the full Attack pipeline: `init → run → applyComputedDamages`.
     * Damage events and lethal detection are handled inside `applyComputedDamages`.
     */
    attack(swa: SlotWeaponAmmo) {
        this.attacker.state.actionTaken = true;
        this.runAttack(swa);
    }

    /**
     * Executes a single weapons attack as the attacker's bonus action.
     * Marks `bonusActionTaken` on the creature so no second bonus action can be taken
     * this round.
     */
    bonusAttack(swa: SlotWeaponAmmo) {
        this.attacker.state.bonusActionTaken = true;
        this.runAttack(swa);
    }

    /**
     * Resolves one combat round for the attacker, respecting the D&D-style action economy:
     * one normal action and one bonus action may be taken per round (not two of either).
     *
     * Normal action (consumed first):
     *   - If a ready scripted normal action is usable at current range, it is executed via
     *     `doAction` (which sets `actionTaken` internally).
     *   - Otherwise, falls back to a weapons attack (`attack()`, which also sets `actionTaken`).
     *   - If neither is available and the attacker is not yet at close range, approaches.
     *
     * Bonus action (attempted after the normal action):
     *   - If a ready scripted bonus action is usable at current range, it is executed via
     *     `doAction` (which sets `bonusActionTaken` internally).
     *
     * The `busy` flag, when set externally, skips the entire round (used for multi-round
     * actions such as spell channels).
     */
    /**
     * Triggered when the attacker's target unilaterally disengages.
     * Clears pending actions and immediately attacks using the first available
     * action slot (normal, then bonus). No attack if both slots are already spent.
     */
    opportunityAttack(): void {
        this._pendingNormalAction = null;
        this._pendingBonusAction = null;
        const swl = this.getSuitableWeaponList();
        if (swl.length === 0) {
            return;
        }
        if (!this.attacker.state.actionTaken) {
            this.attack(swl[0]);
        } else if (!this.attacker.state.bonusActionTaken) {
            this.bonusAttack(swl[0]);
        }
    }

    /**
     * Queues an action to be executed during the next playRound (normal) or
     * playBonusRound (bonus). Queued actions take priority over AI-chosen actions.
     */
    enqueueAction(actionId: string, target: Creature | undefined, bonus: boolean): void {
        const entry: QueuedAction = { actionId, target };
        if (bonus) {
            this._pendingBonusAction = entry;
        } else {
            this._pendingNormalAction = entry;
        }
    }

    playRound() {
        if (this.busy) {
            // attacker is busy (casting a spell or an action)
            this.busy = false;
            return;
        }

        // Normal action slot
        if (!this.attacker.state.actionTaken) {
            const queued = this._pendingNormalAction;
            this._pendingNormalAction = null;
            if (queued) {
                const result = this.attacker.doAction(queued.actionId, queued.target);
                if (!result.success) {
                    const payload: EventCombatActionFailure = {
                        ...queued,
                        bonus: false,
                        reason: result.reason,
                    };
                    this.events.emit(CONSTS.EVENT_COMBAT_ACTION_FAILURE, payload);
                }
            } else {
                const normalActions = this.getNormalOffensiveActionList();
                if (normalActions.length > 0) {
                    this.attacker.doAction(normalActions[0].id, this.target);
                } else {
                    const swl = this.getSuitableWeaponList();
                    if (swl.length > 0) {
                        this.attack(swl[0]);
                    } else if (this.distance !== CONSTS.DISTANCE_CLOSE) {
                        this.approach();
                    }
                }
            }
        }
    }

    playBonusRound() {
        // Bonus action slot
        if (!this.attacker.state.bonusActionTaken) {
            const queued = this._pendingBonusAction;
            this._pendingBonusAction = null;
            if (queued) {
                const result = this.attacker.doAction(queued.actionId, queued.target);
                if (!result.success) {
                    const payload: EventCombatActionFailure = {
                        ...queued,
                        bonus: true,
                        reason: result.reason,
                    };
                    this.events.emit(CONSTS.EVENT_COMBAT_ACTION_FAILURE, payload);
                }
            } else {
                const bonusActions = this.getBonusOffensiveActionList();
                if (bonusActions.length > 0) {
                    this.attacker.doAction(
                        bonusActions[Math.floor(Math.random() * bonusActions.length)].id,
                        this.target
                    );
                    this.attacker.state.bonusActionTaken = true;
                } else {
                    // no action available — use a natural melee weapon if present
                    const nmwl = this.getAltNaturalMeleeWeaponList();
                    if (nmwl.length > 0) {
                        const w = nmwl[Math.floor(Math.random() * nmwl.length)];
                        this.bonusAttack(w);
                    }
                }
            }
        }
    }

    process(): void {
        ++this._internalTimer;
        if ((this._internalTimer & 1) === 0) {
            this.playRound();
        } else {
            this.playBonusRound();
        }
    }
}
