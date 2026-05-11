import { Item } from '../schemas/Item';
import { WeaponBlueprint } from '../schemas/WeaponBlueprint';
import { CONSTS } from '../consts';
import { AmmoBlueprint } from '../schemas/AmmoBlueprint';

/**
 * Return true if specified item is really a weapon (sword, bow, gun...)
 */
export function isWeapon(item: Item | null): item is Item & WeaponBlueprint {
    return !!item && item.itemType === CONSTS.ITEM_TYPE_WEAPON;
}

/**
 * Return true if specified item is really an ammunition (arrow, quarrel, bullet...)
 */
export function isAmmo(item: Item | null): item is Item & AmmoBlueprint {
    return !!item && item.itemType === CONSTS.ITEM_TYPE_AMMO;
}
