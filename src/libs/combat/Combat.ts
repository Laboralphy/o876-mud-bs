import { Creature } from '../../Creature';
import { DISTANCE } from '../distance';
import { Item } from '../../schemas/Item';
import { CONSTS } from '../../consts';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { isAmmo, isWeapon } from '../../store/type-guards';
import { ActionState } from '../../schemas/Action';
import EventEmitter from 'node:events';
import { Attack } from '../../Attack';

type SlotWeaponAmmo = {
    slot: EquipmentSlot;
    weapon: Item;
    ammo?: Item;
};

/**
 * The combat class
 */
export class Combat {
    private distance: DISTANCE = DISTANCE.FAR;
    public readonly events = new EventEmitter();

    constructor(
        public readonly attacker: Creature,
        public readonly target: Creature
    ) {}

    getOffensiveActionList(minDistance: DISTANCE): ActionState[] {
        const readyIds = new Set(
            this.attacker.getters.getActions.filter((a) => a.ready).map((a) => a.id)
        );
        return Object.values(this.attacker.state.actions).filter(
            (action) => action.hostile && action.range >= minDistance && readyIds.has(action.id)
        );
    }

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

    getSuitableWeaponList(): SlotWeaponAmmo[] {
        switch (this.distance) {
            case DISTANCE.FAR:
            case DISTANCE.MEDIUM: {
                return this.getRangedWeaponList();
            }
            case DISTANCE.CLOSE: {
                return this.getMeleeWeaponList();
            }
            default: {
                throw new Error('Invalid distance');
            }
        }
    }

    setDistance(d: DISTANCE, bQuiet: boolean = false) {
        this.distance = d;
        if (!bQuiet) {
            this.events.emit('distance-changed', { distance: d });
        }
    }

    getDistance(): DISTANCE {
        return this.distance;
    }

    approach() {
        switch (this.distance) {
            case DISTANCE.FAR: {
                this.setDistance(DISTANCE.MEDIUM);
                break;
            }
            case DISTANCE.MEDIUM: {
                this.setDistance(DISTANCE.CLOSE);
                break;
            }
            case DISTANCE.CLOSE: {
                break;
            }
            default: {
                throw new TypeError('Invalid distance');
            }
        }
    }

    retreat() {
        switch (this.distance) {
            case DISTANCE.FAR: {
                break;
            }
            case DISTANCE.MEDIUM: {
                this.setDistance(DISTANCE.FAR);
                break;
            }
            case DISTANCE.CLOSE: {
                this.setDistance(DISTANCE.MEDIUM);
                break;
            }
            default: {
                throw new TypeError('Invalid distance');
            }
        }
    }

    attack(swa: SlotWeaponAmmo) {
        this.attacker.state.selectedOffensiveSlot = swa.slot;
        const attack = new Attack(this.attacker, this.target);
        attack.weapon = swa.weapon;
        attack.ammo = swa.ammo ?? null;
        attack.init();
        attack.run();
        attack.applyComputedDamages();
    }

    playRound() {
        const swl = this.getSuitableWeaponList();
        if (swl.length === 0) {
            // No suitable weapon, if far or medium distance, the try to move closer
            if (this.distance === DISTANCE.FAR || this.distance === DISTANCE.MEDIUM) {
                this.approach();
            }
        } else {
            // There is at least one suitable weapon, attack
            this.attack(swl[0]);
        }
    }
}
