/**
 * Transform: monsters (CreatureBlueprint)
 *
 * Expected CSV columns:
 *   id, specie, size, ac,
 *   body, senses, mind, presence,
 *   proficiencies,
 *   action, cooldown, charges, bonus-action,
 *   traits, property, amp, param-name, param-value,
 *   equipment
 *
 * - id           : unique ref (e.g. c-goblin); triggers a new entity
 * - specie       : beast | humanoid | undead | construct | dragon | ... → SPECIE_xxx
 * - size         : tiny | small | medium | large | huge | gargantuan → CREATURE_SIZE_xxx
 * - ac           : base armor class (integer)
 * - body/senses/mind/presence : ability scores (integers)
 * - proficiencies: proficiency short name — repeatable
 *                  simple | complex | unarmed | armor-light | armor-medium | armor-heavy | shield
 * - action       : action blueprint id (e.g. act-fire-breath-2d6) — repeatable
 * - cooldown     : cooldown in turns for the last pushed action
 * - charges      : charges per cooldown for the last pushed action
 * - bonus-action : TRUE | FALSE — is bonus action for the last pushed action
 * - traits       : extended-properties bundle ref (e.g. cp-undead) — repeatable
 * - property     : defensive property short name — repeatable
 * - amp          : amp for the last pushed defensive property
 * - param-name   : extra param key for the last pushed defensive property
 * - param-value  : extra param value
 * - equipment    : item or natural weapon ref (e.g. nw-bite-1d6, wpn-long-bow) — repeatable
 */

export const HEADERS = [
    'id',
    'specie',
    'size',
    'ac',
    'body',
    'senses',
    'mind',
    'presence',
    'proficiencies',
    'action',
    'cooldown',
    'charges',
    'bonus-action',
    'traits',
    'property',
    'amp',
    'param-name',
    'param-value',
    'equipment',
];

export const SCRIPTS = [
    /* id           */ `output(); id(value); c={ entityType: 'ENTITY_TYPE_CREATURE', abilities: {}, armorClass: 0, specie: '', size: 'CREATURE_SIZE_MEDIUM', proficiencies: ['PROFICIENCY_UNARMED'], properties: [], equipment: [], actions: [] }`,
    /* specie       */ `c.specie = ref(value, 'SPECIE')`,
    /* size         */ `c.size = ref(value, 'CREATURE_SIZE')`,
    /* ac           */ `c.armorClass = value`,
    /* body         */ `c.abilities.ABILITY_BODY = value`,
    /* senses       */ `c.abilities.ABILITY_SENSES = value`,
    /* mind         */ `c.abilities.ABILITY_MIND = value`,
    /* presence     */ `c.abilities.ABILITY_PRESENCE = value`,
    /* proficiencies*/ `c.proficiencies.push(ref(value, 'PROFICIENCY'))`,
    /* action       */ `c.actions.push({ id: value, cooldown: 0, charges: 1, bonus: false })`,
    /* cooldown     */ `last(c.actions).cooldown = value`,
    /* charges      */ `last(c.actions).charges = value`,
    /* bonus-action */ `last(c.actions).bonus = value`,
    /* traits       */ `if (!c.extends) { c.extends = [] } c.extends.push(value)`,
    /* property     */ `c.properties.push({ type: ref(value, 'property') })`,
    /* amp          */ `last(c.properties).amp = value`,
    /* param-name   */ ``,
    /* param-value  */ `kv(last(c.properties))`,
    /* equipment    */ `c.equipment.push(value)`,
];
