/**
 * Transform: common-props (ExtendedProperties bundles)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, extends, property, amp, param-name, param-value
 *
 * - id         : unique ref for this bundle (e.g. cp-undead); triggers a new entity
 * - extends    : ref to another bundle this one inherits from — repeatable
 * - property   : property type short name (e.g. immunity, damage-resistance, darkvision)
 * - amp        : amplitude for properties that need it (e.g. damage-modifier)
 * - param-name : extra param key (e.g. immunityType, damageType)
 * - param-value: extra param value (e.g. IMMUNITY_TYPE_PARALYSIS, DAMAGE_TYPE_THERMAL)
 */

export const HEADERS = ['id', 'extends', 'property', 'amp', 'param-name', 'param-value'];

export const SCRIPTS = [
    /* id         */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_EXTENDED_PROPERTIES', properties: [] }`,
    /* extends    */ `if (!c.extends) { c.extends = [] } c.extends.push(value)`,
    /* property   */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp        */ `last(c.properties).amp = value`,
    /* param-name */ ``,
    /* param-value*/ `kv(last(c.properties))`,
];
