# MUD BS PLANNING

## Features to be implemented

- Carefully select what effects/property to implement.
- Design immunity according to selected effects.
- Implement effects/properties programs when needed.
- Design skills.
- Design an external spreadsheet to store the data.
- Create a batch to download spreadsheet data and generate blueprint files out of it.
- Combat system. Create a combat instance, design the combat orchestration
- Action system. How can action influence a combat.
- Spellcasting system. Carefuly select what kind of spells to implement.

## Details

### Effect/property to implement

What are the relevant properties and effects ? Should I include disabling effects like petrification ?
What are the consequences of FEAR ? (Cannot fight, must flee)
What are the consequences of STUN ? (Cannot do anything)
What are the effect of PARALYSIS ? (Cannot do anything, effect is breakable when attacked)
What are the maluses whan attacking an undetected target (in darkness, fog, or while blinded)
What are the consequences of CHARM ? (Cannot do hostile action against charmer)
What are the DISEASES I should implement ?
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

- ability-modifier
- ability-check-modifier
- ability-resistance-modifier
- armor-class-modifier
- attack-modifier
- extra-hitpoints
- skill-modifier
- speed-factor

#### Vision

- darkvision
- light
- invisibility
- see-invisibility
- stealth

#### Debuffs

- blindness
- charm
- fear
- stun
- petrification
- paralysis

#### Damage

- damage
- damage-immunity
- damage-modifier
- damage-reduction
- damage-resistance
- damage-vulnerability

#### Healing

- heal
- healing-factor
- healing-modifier
- regeneration
