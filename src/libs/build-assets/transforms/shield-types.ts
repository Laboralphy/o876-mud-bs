/**
 * Transform: shield-types (ShieldBlueprint type templates)
 *
 * Expected CSV columns (header row only, no script row in the sheet):
 *   id, armorClass, ac-slashing, ac-piercing, ac-crushing, weight, property, amp, paramName, paramValue
 *
 * - id          : unique ref (e.g. shd-type-small); triggers a new entity
 * - armorClass  : base AC bonus (integer)
 * - ac-slashing : AC modifier vs slashing damage; creates a PropertyArmorClassModifier
 * - ac-piercing : AC modifier vs piercing damage
 * - ac-crushing : AC modifier vs crushing damage
 * - weight      : kg, decimals with dot or comma
 * - property    : additional property short name (repeatable on continuation rows)
 * - amp         : amplitude for the last pushed property
 * - paramName   : extra param key (e.g. attackType)
 * - paramValue  : extra param value (e.g. ATTACK_TYPE_RANGED)
 *
 * Proficiency is always PROFICIENCY_SHIELD — no column needed.
 */

export const HEADERS = [
    'id', 'armorClass', 'ac-slashing', 'ac-piercing', 'ac-crushing',
    'weight', 'property', 'amp', 'paramName', 'paramValue',
];

export const SCRIPTS = [
    /* id          */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_ITEM', itemType: 'ITEM_TYPE_SHIELD', proficiency: 'PROFICIENCY_SHIELD', armorClass: 0, weight: 0, properties: [], equipmentSlots: ['EQUIPMENT_SLOT_SHIELD'] }`,
    /* armorClass  */ `c.armorClass = value`,
    /* ac-slashing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_SLASHING' })`,
    /* ac-piercing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_PIERCING' })`,
    /* ac-crushing */ `c.properties.push({ type: 'PROPERTY_ARMOR_CLASS_MODIFIER', amp: value, damageType: 'DAMAGE_TYPE_CRUSHING' })`,
    /* weight      */ `c.weight = parseFloat(value.toString().replace(/,/g, '.'))`,
    /* property    */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp         */ `last(c.properties).amp = value`,
    /* paramName   */ ``,
    /* paramValue  */ `kv(last(c.properties))`,
];
