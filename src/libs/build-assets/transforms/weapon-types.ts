/**
 * Transform: weapon-types (WeaponBlueprint type templates)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, proficiency, damages, damageType, weight, size, ammoType, attributes, slot, property, amp, paramName, paramValue
 *
 * - id          : unique ref (e.g. wpn-type-long-sword); triggers a new entity
 * - proficiency : simple | complex | expert | magic | technologic
 * - damages     : dice expression (e.g. 1d8, 2d6+2) — passed through as-is
 * - damageType  : slashing | piercing | crushing | thermal | cryogenic | electric | chemical | necrotic | radiant
 * - weight      : kg, decimals with dot or comma (e.g. 1.5 or 1,5)
 * - size        : small | medium | large | reach
 * - ammoType    : arrow | quarrel — leave empty for melee weapons
 * - attributes  : finesse | versatile | two-handed | reach | ranged | ammunition | loading (repeatable on continuation rows)
 * - slot        : melee | ranged (repeatable on continuation rows)
 * - property    : property short name (repeatable on continuation rows)
 * - amp         : amplitude for the last pushed property
 * - paramName   : extra param key (e.g. damageType, immunityType)
 * - paramValue  : extra param value
 */

export const HEADERS = [
    'id',
    'proficiency',
    'damages',
    'damageType',
    'altDamageType',
    'weight',
    'size',
    'ammoType',
    'attributes',
    'slot',
    'property',
    'amp',
    'paramName',
    'paramValue',
];

export const SCRIPTS = [
    /* id          */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_WEAPON', proficiency: '', damages: '', damageType: '', altDamageType: '', weight: 0, size: '', attributes: [], properties: [], equipmentSlots: [] }`,
    /* proficiency */ `c.proficiency = ref(value, 'PROFICIENCY')`,
    /* damages     */ `c.damages = value`,
    /* damageType  */ `c.damageType = ref(value, 'DAMAGE_TYPE')`,
    /* altDamageType  */ `c.altDamageType = ref(value, 'DAMAGE_TYPE')`,
    /* weight      */ `c.weight = parseFloat(value.toString().replace(/,/g, '.'))`,
    /* size        */ `c.size = ref(value, 'WEAPON_SIZE')`,
    /* ammoType    */ `c.ammoType = ref(value, 'AMMO_TYPE')`,
    /* attributes  */ `c.attributes.push(ref(value, 'WEAPON_ATTRIBUTE'))`,
    /* slot        */ `c.equipmentSlots.push(ref(value, 'EQUIPMENT_SLOT'))`,
    /* property    */ `c.properties.push({ type: ref(value, 'PROPERTY') })`,
    /* amp         */ `last(c.properties).amp = value`,
    /* paramName   */ ``,
    /* paramValue  */ `kv(last(c.properties))`,
];
