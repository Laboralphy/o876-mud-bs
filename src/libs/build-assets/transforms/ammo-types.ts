/**
 * Transform: ammo-types (AmmoBlueprintSchema type templates)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, ammoType, damageType, altDamageType, weight, property, amp, paramName, paramValue
 *
 * - id           : unique ref (e.g. ammo-type-arrow); triggers a new entity
 * - ammoType     : arrow | quarrel → AMMO_TYPE_ARROW / AMMO_TYPE_QUARREL
 * - damageType   : piercing | slashing | crushing | thermal | ... (required)
 * - altDamageType: optional secondary damage type
 * - weight       : kg per unit, decimals with dot or comma (e.g. 0.1 or 0,1)
 * - property     : additional property short name (repeatable on continuation rows)
 * - amp          : amplitude for the last pushed property
 * - paramName    : extra param key
 * - paramValue   : extra param value
 */

export const HEADERS = [
    'id',
    'damageType',
    'altDamageType',
    'weight',
    'property',
    'amp',
    'paramName',
    'paramValue',
];

export const SCRIPTS = [
    /* id           */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_AMMO', ammoType: ref(value, 'AMMO_TYPE'), damageType: '', weight: 0, properties: [], equipmentSlots: ['EQUIPMENT_SLOT_AMMO'] }`,
    /* damageType   */ `c.damageType = ref(value, 'DAMAGE_TYPE')`,
    /* altDamageType*/ `c.altDamageType = ref(value, 'DAMAGE_TYPE')`,
    /* weight       */ `c.weight = parseFloat(value.toString().replace(/,/g, '.'))`,
    /* property     */ `c.properties.push({ type: ref(value, 'PROPERTY') })`,
    /* amp          */ `last(c.properties).amp = value`,
    /* paramName    */ ``,
    /* paramValue   */ `kv(last(c.properties))`,
];
