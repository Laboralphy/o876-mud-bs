# Actions Reference

All commands trigger a skill check: `d20 + mod(primaryStat) + floor(mod(secondaryStat) / 2) + conditions`

---

## Movement & Traversal

| Command | Skill | Description |
|---|---|---|
| `/climb` | ATHLETICS | Scale a wall or reach an upper room when the standard `/up` exit is blocked. Failure causes a fall and damage. |
| `/swim` | ATHLETICS | Cross an underwater exit. Failure causes drowning damage. |
| `/bash` | ATHLETICS | Force open a stuck or locked door through raw strength. Failure deals self-damage; the door holds. |
| `/flee` | ACROBATICS | Break away from a fight without taking damage. Ignores difficult terrain penalties on success. |
| `/find` | NAVIGATION | Determine the direction to a town, dungeon exit, or the nearest tavern. |

---

## Combat & Aggression

| Command | Skill | Description |
|---|---|---|
| `/sneak` | STEALTH | Strike a target who is idle or already engaged with someone else. Deals double damage on success. Requires being hidden. |
| `/rage` | INTIMIDATION | Intimidate a target through raw physical menace, applying a temporary AC debuff from fear. |
| `/rally` | LEADERSHIP | Inspire nearby allies, temporarily boosting their attack bonus and preventing them from fleeing. |

---

## Stealth & Infiltration

| Command | Skill | Description |
|---|---|---|
| `/hide` | STEALTH | Conceal yourself from sight and sound. Allows unnoticed movement through a room. |
| `/stalk` | TRACKING | Locate a specific creature, player, or named enemy and learn their current position. |
| `/disguise` | DISGUISE | Assume a new identity using available materials. NPCs react to your assumed role until the illusion breaks. |
| `/blend` | DISGUISE | Disappear into a crowd or environment through posture and manner alone, without a full costume. |
| `/bluff` | DECEPTION | Convince a target that something false is true — a distraction, a denial, a misdirection. |

---

## Exploration & Investigation

| Command | Skill | Description |
|---|---|---|
| `/search` | PERCEPTION | Sweep a room for hidden items, concealed passages, or overlooked details. |
| `/scan` | TRAP_DETECTION | Deliberately survey a room to reveal all traps present. Less reliable than the passive trigger. |
| `/disarm` | TRAP_DETECTION | Neutralize a detected trap. Failure triggers it at point-blank range. |
| `/examine` | INVESTIGATION | Analyze a specific object or location in detail — residues, mechanisms, inconsistencies. Results go to notes. |
| `/deduce` | INVESTIGATION | Connect gathered clues into a coherent conclusion. Requires sufficient prior evidence in the room or notes. |

---

## Survival & Medicine

| Command | Skill | Description |
|---|---|---|
| `/recover` | ENDURANCE | Rest and recover hitpoints mid-situation. Also grants a second attempt at `/climb`, `/swim`, or `/bash`. |
| `/rest` | SURVIVAL | Find a safe place to sleep in a hostile environment without attracting attention. |
| `/cook` | SURVIVAL | Produce food and water from a vegetable or animal corpse in the room. |
| `/harvest` | SURVIVAL | Extract a usable item from a corpse. |
| `/heal` | SURVIVAL | Apply a first aid kit to yourself or a nearby character to restore hitpoints. |
| `/diagnose` | MEDICINE | Identify the exact condition of a creature — disease, poison type, injury severity. Informs which treatment to use. |
| `/treat` | MEDICINE | Remove a disease or neutralize a poison from yourself or a nearby character. Requires materials. |
| `/stabilize` | MEDICINE | Stop a dying character from bleeding out. Buys time without restoring hitpoints. |

---

## Crafting & Technical

| Command | Skill | Description |
|---|---|---|
| `/brew` | ALCHEMY | Combine inventory ingredients into a potion, poison, or compound. Failure wastes materials or produces an unintended result. |
| `/analyze` | ALCHEMY | Identify the composition and effect of an unknown substance, liquid, or residue. |
| `/craft` | PRECISION_CRAFTING | Fabricate a weapon component, tool, or mechanism from raw materials. Quality scales with the margin of success. |
| `/repair` | PRECISION_CRAFTING / TECHNOLOGY | Restore a damaged item or broken device to working condition. Source skill depends on the target: crafted objects use PRECISION_CRAFTING, machines and electronics use TECHNOLOGY. |
| `/pick` | LOCKPICKING | Open a locked door or container without a key. Failure may snap picks, jam the lock, or trigger an alarm. |
| `/tinker` | LOCKPICKING | Manipulate a small mechanism — disable a latch, adjust a gear, bypass a simple security device. |
| `/hack` | TECHNOLOGY | Bypass an electronic lock, security panel, or networked system. Failure may trigger an alert or lockout. |
| `/interface` | TECHNOLOGY | Operate unfamiliar technology — extract data, activate systems, navigate interfaces without triggering safeties. |

---

## Social & Influence

| Command | Skill | Description |
|---|---|---|
| `/comfort` | EMPATHY | Soothe a distressed NPC or ally, reducing fear, grief, or hostility. May shift behavior or unlock dialog options. |
| `/barter` | NEGOTIATION | Negotiate better trade terms — lower buy prices, higher sell values. Failure leaves the merchant unmoved. |
| `/inspire` | MORALE | Restore the will to fight in a frightened or demoralized ally, removing fear debuffs. |
| `/inquire` | STREETWISE | Locate a specific person, fence, or hidden establishment in an inhabited area. Failure draws the wrong attention. |
| `/presence` | AURA | Project your aura deliberately — silence a room, command attention, or defuse tension before it becomes violence. |

---

## Magic & Faith

| Command | Skill | Description |
|---|---|---|
| `/identify` | ARCANA | Discern the magical properties of an unknown item or effect. On failure, the item stays unidentified. |
| `/read` | ARCANA | Decipher magical writing, glyphs, ritual inscriptions, or runic sequences. |
| `/pray` | FAITH | Invoke faith for real intervention — restore vigor, lift a curse, or gain a temporary resistance bonus. Has a cost; cannot be spammed. |

---

## Summary

| Count | Category |
|---|---|
| 5 | Movement & Traversal |
| 3 | Combat & Aggression |
| 5 | Stealth & Infiltration |
| 5 | Exploration & Investigation |
| 8 | Survival & Medicine |
| 8 | Crafting & Technical |
| 5 | Social & Influence |
| 3 | Magic & Faith |
| **42** | **Total** |

> **Note:** `/repair` is shared between PRECISION_CRAFTING and TECHNOLOGY. The governing skill is determined by the nature of the target object.
