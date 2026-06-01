/**
 * Transform: gear-types (GearBlueprint type templates)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, itemType, weight, slot, property, amp, paramName, paramValue
 *
 * - id       : unique ref (e.g. gear-type-ring); triggers a new entity
 * - itemType : helm | hat | necklace | bracers | gauntlets | gloves | ring | belt | boots | cloak | torch
 * - weight   : kg, decimals with dot or comma
 * - slot     : equipment slot short name (repeatable on continuation rows)
 *              e.g. head | neck | arms | finger-left | finger-right | waist | feet | shield | back
 * - property : property short name (repeatable on continuation rows)
 * - amp      : amplitude for the last pushed property
 * - paramName: extra param key
 * - paramValue: extra param value
 */

export const HEADERS = [
    'id', 'itemType', 'weight', 'slot', 'property', 'amp', 'paramName', 'paramValue',
];

export const SCRIPTS = [
    /* id        */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: '', weight: 0, properties: [], equipmentSlots: [] }`,
    /* itemType  */ `c.itemType = ref(value, 'ITEM_TYPE')`,
    /* weight    */ `c.weight = parseFloat(value.toString().replace(/,/g, '.'))`,
    /* slot      */ `c.equipmentSlots.push(ref(value, 'equipment_slot'))`,
    /* property  */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp       */ `last(c.properties).amp = value`,
    /* paramName */ ``,
    /* paramValue*/ `kv(last(c.properties))`,
];
