# MUD BS PLANNING

## Features to be implemented

- [x] Carefully select what effects/property to implement.
- [x] Design immunity according to selected effects.
- [x] Implement effects/properties programs when needed.
- [x] Design skills.
- [x] Combat system. Create a combat instance, design the combat orchestration
- [x] Action system. How can action influence a combat.
- [ ] Description system
- [ ] Spellcasting system. Carefully select what kind of spells to implement.
- [ ] Design an external spreadsheet to store the data.
- [ ] Create a batch to download spreadsheet data and generate blueprint files out of it.

## Details

### Effect/property to implement

What are the relevant properties and effects ? Should I include disabling effects like petrification ?
What are the consequences of FEAR ? (Cannot fight, must flee)
What are the consequences of STUN ? (Cannot do anything)
What are the effect of PARALYSIS ? (Cannot do anything, effect is breakable when attacked)
What are the maluses whan attacking an undetected target (in darkness, fog, or while blinded)
What are the consequences of CHARM ? (Cannot do hostile action against charmer)
What are the DISEASES I should implement ? → **ghoul-fever**, **mummy-rot**, **rat-sickness**
What are the AILMENTS I should implement (cause negative effect are conveyed with a weapon hit)

### Implementation of effects/properties programs.

### Design an external spreadsheet to store the data.

Should I use templates or inheritance to avoid copy/paste ?

### Create a batch to download spreadsheet data and generate blueprint files out of it.

Reuse the batch system from o876-battle-system-ts project ; or create a new one ?

### Combat system.

How to properly manage fight between ranged attack and melee attack ?

### Action system.

Implementation of a cooldown system.
Definition of an action.
How actions are gained by players ?

### Spell system.

Choose spells to implement.
Choose spells consumption system (mana ? vancian spell slots ?)

## Implementation

### Effects

#### Modifiers

- **ability-modifier**
- **ability-check-modifier**
- **ability-resistance-modifier**
- **armor-class-modifier**
- **attack-modifier**
- **extra-hitpoints**
- **skill-modifier**
- **speed-factor**

#### Vision

- **darkvision**
- **light**
- **invisibility**
- **see-invisibility**
- **stealth**

#### Debuffs

- **blindness** - Can't see anything
- **charm** - Can't attack its charmer
- **fear** - Can't take action except moving
- **stun** - Can't do anything for a short amount of time
- **paralysis** - Can't do anything, but a body check may end the effect
- **petrification** - Can't do anything permanantly, need specific cure to treat.
- **disease** - Various malign sub effects.
- **poison** - loses HP periodically - must be cured before effect end or die

#### Damage

- **damage**
- **damage-immunity**
- **damage-modifier**
- **damage-reduction**
- **damage-resistance**
- **damage-vulnerability**

#### Healing

- **heal**
- **healing-factor**
- **healing-modifier**
- **regeneration**


### Properties

#### Modifiers

- **ability-check-modifier**
- **ability-modifier**
- **ability-resistance-modifier**
- **armor-class-modifier**
- **attack-modifier**
- **extra-hitpoints**

#### Item specific

- **cursed**
- **extra-weapon-damage-type**
- **weight-factor**
- **unidentified**

#### Damage

- **damage-immunity**
- **damage-modifier**
- **damage-reduction**
- **damage-resistance**
- **damage-vulnerability**

#### Vision

- **darkvision**
- **light**

#### Heal

- **healing-factor**
- **healing-modifier**
- **regeneration**


### ThreatTypes

Categories of threats used for immunity/resistance checks.

- **BODY_DECAY** - Rot and body deterioration (disease, mummy rot)
- **CHARM** - Charm and domination effects
- **DISEASE** - Disease effects
- **FEAR** - Mental fear effects
- **PARALYSIS** - Paralysis effects
- **PETRIFICATION** - Petrification effects
- **POISON** - Poison effects
- **SPELL** - Generic magical spell effects


### Diseases

Specific diseases conveyed by the `disease` effect.

- **ghoul-fever** - Undead-transmitted disease
- **mummy-rot** - Mummy-transmitted rotting disease
- **rat-sickness** - Vermin-transmitted illness
