/**
 * Transform: natural weapon blueprints (WeaponBlueprint)
 *
 * Expected CSV columns:
 *   id, damages, damage-type, alt-damage-type, attributes, property, amp, param-name, param-value
 *
 * - id             : unique ref (e.g. nw-bite-1d6); triggers a new entity
 * - damages        : damage dice expression (e.g. 1d6, 2d10)
 * - damage-type    : primary damage type short name → DAMAGE_TYPE_xxx
 * - alt-damage-type: secondary damage type short name → DAMAGE_TYPE_xxx (optional)
 * - attributes     : weapon attribute short name (e.g. ranged, finesse) → WEAPON_ATTRIBUTE_xxx (repeatable)
 * - property       : property short name (repeatable on continuation rows)
 * - amp            : amplitude for the last pushed property
 * - param-name     : extra param key for the last pushed property
 * - param-value    : extra param value
 */

export const HEADERS = [
    'id',
    'damages',
    'damage-type',
    'alt-damage-type',
    'attributes',
    'property',
    'amp',
    'param-name',
    'param-value',
];

export const SCRIPTS = [
    /* id             */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_WEAPON', proficiency: 'PROFICIENCY_UNARMED', weight: 0, size: 'WEAPON_SIZE_SMALL', damages: '1d3', damageType: 'DAMAGE_TYPE_CRUSHING', attributes: [], properties: [], equipmentSlots: ['EQUIPMENT_SLOT_NATURAL_WEAPON_1', 'EQUIPMENT_SLOT_NATURAL_WEAPON_2', 'EQUIPMENT_SLOT_NATURAL_WEAPON_3'] }`,
    /* damages        */ `c.damages = value`,
    /* damage-type    */ `c.damageType = ref(value, 'DAMAGE_TYPE')`,
    /* alt-damage-type*/ `c.altDamageType = ref(value, 'DAMAGE_TYPE')`,
    /* attributes     */ `c.attributes.push(ref(value, 'WEAPON_ATTRIBUTE'))`,
    /* property       */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp            */ `last(c.properties).amp = value`,
    /* param-name     */ ``,
    /* param-value    */ `kv(last(c.properties))`,
];
