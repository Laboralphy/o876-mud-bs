import { Creature } from '../../Creature';
import { Item } from '../../schemas/Item';
import { EquipmentSlot } from '../../schemas/enums/EquipmentSlot';
import { CONSTS } from '../../consts';
import { isWeapon } from '../../store/type-guards';

export type EquippedWeapon = {
    slot: EquipmentSlot;
    item: Item;
    range: number;
    isRanged: boolean;
    isNatural: boolean;
};

const WEAPON_SLOTS: EquipmentSlot[] = [
    CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE,
    CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3,
];

const NATURAL_SLOTS = new Set<EquipmentSlot>([
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2,
    CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3,
]);

function getWeaponRange(item: Item): number {
    if (!isWeapon(item)) {
        return 0;
    }
    const attrs = new Set(item.attributes);
    if (attrs.has(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
        return 100;
    }
    if (attrs.has(CONSTS.WEAPON_ATTRIBUTE_REACH) || item.size === CONSTS.WEAPON_SIZE_REACH) {
        return 10;
    }
    return 5;
}

export function getEquippedWeaponList(attacker: Creature): EquippedWeapon[] {
    const eq = attacker.state.equipment;
    return WEAPON_SLOTS
        .filter((slot) => isWeapon(eq[slot]))
        .map((slot) => {
            const item = eq[slot] as Item;
            const attrs = new Set(isWeapon(item) ? item.attributes : []);
            const isRanged = attrs.has(CONSTS.WEAPON_ATTRIBUTE_RANGED);
            return {
                slot,
                item,
                range: getWeaponRange(item),
                isRanged,
                isNatural: NATURAL_SLOTS.has(slot),
            };
        });
}

export function getEquippedRangedWeaponList(attacker: Creature): EquippedWeapon[] {
    return getEquippedWeaponList(attacker).filter((w) => w.isRanged);
}

export function getEquippedMeleeWeaponList(attacker: Creature): EquippedWeapon[] {
    return getEquippedWeaponList(attacker).filter((w) => !w.isRanged && !w.isNatural);
}

export function getEquippedNaturalWeaponList(attacker: Creature): EquippedWeapon[] {
    return getEquippedWeaponList(attacker).filter((w) => w.isNatural);
}

/**
 * Switch attacker's selected offensive slot to the best weapon for the given distance.
 *
 * Priority at melee range (≤ 5):  melee → natural → ranged (loaded)
 * Priority at reach range (≤ 10): natural → melee (reach) → ranged (loaded)
 * Priority at ranged range (> 10): ranged (loaded) → reach melee/natural → nothing
 *
 * Among candidates of equal priority, prefer the shortest range that still covers
 * the distance (preserve ranged ammo, avoid overkill).
 *
 * Returns the selected slot, or null if no equipped weapon can reach the target.
 */
export function selectBestWeaponForDistance(
    attacker: Creature,
    distance: number
): EquipmentSlot | null {
    const rangedLoaded = attacker.getters.isRangedWeaponLoaded;
    const weapons = getEquippedWeaponList(attacker);

    // Filter to weapons that can actually reach, respecting load state for ranged.
    const reachable = weapons.filter(
        (w) => w.range >= distance && (!w.isRanged || rangedLoaded)
    );

    if (reachable.length === 0) {
        return null;
    }

    // Scoring: lower is better.
    // Base score by type preference for this distance range, then tie-break by range ascending.
    const score = (w: EquippedWeapon): number => {
        const rangePenalty = w.range; // prefer shorter range when multiple cover the distance
        if (distance <= 5) {
            // Melee range: prefer melee → natural → ranged
            if (!w.isRanged && !w.isNatural) return 0 + rangePenalty;
            if (w.isNatural)                return 1000 + rangePenalty;
            return                                 2000 + rangePenalty;
        } else {
            // Beyond melee: prefer ranged → natural/reach melee → everything else
            if (w.isRanged)  return 0 + rangePenalty;
            if (w.isNatural) return 1000 + rangePenalty;
            return                   2000 + rangePenalty;
        }
    };

    reachable.sort((a, b) => score(a) - score(b));
    const best = reachable[0];

    attacker.state.selectedOffensiveSlot = best.slot;
    return best.slot;
}
