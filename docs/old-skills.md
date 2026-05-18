# Skills Reference

All skill checks resolve as: `d20 + mod(primaryStat) + floor(mod(secondaryStat) / 2) + conditions`

---

## Body / Body

### SKILL_ATHLETICS
Raw physical power applied to movement and effort — climbing, swimming, jumping, forcing open doors, carrying heavy loads.
No technique, no finesse. Just the body doing what bodies do when pushed to their limit.

#### Commands
- /climb : When /up command fails, use /climb. On a successful athletics check, you manage to get to upper room with
not effort. On a failure, you fall down and take damage.
- /swim : When an exit is underwater, use /swim. On a successful athletics check, you manage to swim to the exit.
On a failure, you drown and take damage.
- /bash : Forcing a door with and mitigating damage. On a successful athletics check, the door opens. You take little damage.
On a failure, you take damage and the door does not budge.

### SKILL_ENDURANCE
The capacity to keep going when the body has already decided it's done. Running until the lungs burn, fighting through
the third hour of a battle, staying conscious after blood loss that should have ended things.
Not about being unbreakable. About breaking later than everything else.

#### Passive
- When failing at climbing, swimming, or bashing, you may take a second chance.
- You have a chance to resist the effects of stun and paralysis
- The regular vigor saving throw.

#### Commands
- /recover : After a successful endurance check, you recover some hitpoints. and you have a second chance of trying /swim /climb or /bash.

---

## Body / Sense

### SKILL_ACROBATICS
The body's ability to move with precision through difficult space — vaulting, tumbling, balancing on narrow surfaces,
landing without breaking bones. Where Athletics is about power, Acrobatics is about control.

#### Passive
- Ignoring a difficult terrain environment penalties.

#### Commands
- /flee : On a successful check, you flee from the target without taking damage. You ignore difficult terrain penalties.

### SKILL_STEALTH
Moving without being seen or heard. Pressing yourself into shadows, timing footsteps to background noise, controlling breathing.
The body as something that can simply cease to exist in a room.

#### Commands
- /hide : On a successful check, you hide. You can't be seen or heard by anyone. You can leave the room unnoticed.
- /sneak : On a successful check, your attack does double damage. Your target must be idle, or fighting someone else.

---

## Body / Mind

### SKILL_DISCIPLINE
The capacity to endure. Pain, hunger, fear, exhaustion — and to keep functioning anyway. Not the absence of suffering,
but the refusal to let it decide. Soldiers have it. Survivors have it. Most people discover too late they don't.

#### Passive
- Resisting the effects of hunger, thirst, fear, and exhaustion.

### SKILL_SURVIVAL
Staying alive in hostile environments through practical knowledge and physical resourcefulness. Finding water, building shelter,
navigating without landmarks, treating wounds with what's at hand. The world is trying to kill you.
This skill is your argument against it.

#### Commands
- /cook : On a successful check, you can produce food and water out of any vegetable, or animal corpse in this room.
- /harverst : On a successful check, you can extract a usable item from a corpse.
- /rest : On a successful check, you can find a place to sleep without attracting unwanted attention.
- /heal : On a successful check, you can apply a first aid kit to yourself or a nearby character.

---

## Body / Presence

### SKILL_INTIMIDATION
Making someone afraid of you through physical presence — size, posture, the promise of violence communicated without words.
Not a bluff. The target needs to believe, on some animal level, that you could and would hurt them.

#### Commands
- /rage : On a successful check, you can intimidate your target making them fear you. This applies a temporary AC debuff.

#### Dialogs
- On a successful check, some extra dialog lines appear, and you can safely intimidate your interlocutor. On failure,
the dialog line does not appear.

### SKILL_SEDUCTION
Using physical presence and body language to attract, distract, or manipulate. Less about beauty than about intent —
the deliberate projection of desire. Works best when the target wants to believe it.

#### Dialogs
- On a successful check, some extra dialog lines appear, and you can safely seduce your interlocutor.
On failure, the dialog line does not appear.

---

## Sense / Body

### SKILL_TRACKING
Tracking, stalking, and bringing down prey. Reading terrain, anticipating movement, closing the distance without being detected.
Whether the prey is an animal or a person changes very little about the process.

#### Commands
- /stalk : On a successful check, you can have information where a target (creature, player, strong enemy) is.

### SKILL_NAVIGATION
Following a trail — footprints, disturbed foliage, the faint smell of smoke, the pattern of fear in how someone moves through
a space. Reading what was there by what remains.

#### Commands
- /find : On a successful check, you can have information where to go to get to a town, a dungeon exit, or the nearest tavern.

---

## Sense / Sense

### SKILL_PERCEPTION
Noticing things. What is out of place, what is missing, what doesn't fit. The guard who blinks too slowly.
The door that was closed this morning. The smell of something burned trying to smell like nothing.
Perception is the skill that tells you something is wrong before you know what it is.

#### Commands
- /search : On a successful check, you find hidden items, concealed passages, or overlooked details in the room.
On a failure, the room appears as it is — which may or may not be how it actually is.

### SKILL_REFLEX
The body's ability to react before the mind catches up. Catching a falling object, ducking a thrown punch,
pulling a hand back from a triggering pressure plate. The gap between stimulus and response, made as small as possible.

#### Passive
- Like the regular reflex saving throw : avoid trap, avoid fire ball, explosion blasts...

---

## Sense / Mind

### SKILL_INVESTIGATION
Active, methodical searching for information — examining a crime scene, searching a room for hidden compartments,
cross-referencing accounts for inconsistencies. Where Perception notices, Investigation understands.

#### Passive
- When you enter a room that contains a clue, a concealed mechanism, or a staged scene, you have a chance to notice
that something demands closer attention — without knowing yet what it is.

#### Commands
- /examine : On a successful check, you analyze an object or location in detail, uncovering residues, mechanisms,
inconsistencies, or information not visible to untrained eyes. Results are added to your notes.
- /deduce : On a successful check and with enough gathered clues, you connect what you've found into a coherent
conclusion — the likely cause, the culprit, the hidden purpose of a place.

#### Dialogs
- On a successful check, you can confront your interlocutor with pointed questions they weren't expecting.
Extra dialog lines appear that press on inconsistencies in their story. On failure, you have nothing to press with.

### SKILL_TRAP_DETECTION
Reading an environment for things designed to hurt you. Pressure plates, tripwires, poisoned handles, collapsing floors,
magical wards. Experience and paranoia, formalized into a method.

#### Passive
- When entering a new room or interacting with an object, you have a chance to automatically notice a trap before
it triggers. A discreet warning message appears.

#### Commands
- /scan : On a successful check, you perform a deliberate sweep of the room, revealing all traps present.
On failure, the room appears clean.
- /disarm : On a successful check, you neutralize a detected trap without triggering it. On failure, the trap fires
and you take its full effect at point-blank range.

---

## Sense / Presence

### SKILL_INSIGHT
Reading people — their intentions, their emotional state, the gap between what they say and what they mean.
Not empathy exactly. More like pattern recognition applied to human behavior. Cold, accurate, occasionally unsettling.

#### Passive
- When an NPC lies to you directly, you have a chance to detect it automatically. A discreet message alerts you
to the discrepancy — not what the truth is, only that this is not it.

#### Dialogs
- On a successful check, you perceive the motive behind your interlocutor's words before they finish speaking.
Extra dialog lines appear that acknowledge what they haven't said. On failure, you take them at face value.

### SKILL_EMPATHY
Feeling what others feel, or at least modeling it closely enough to respond to it. Useful for negotiation, comfort, manipulation.
The difference between Insight and Empathy is that Insight observes from outside.
Empathy steps inside, briefly, and looks around.

#### Commands
- /comfort : On a successful check, you soothe a distressed NPC or ally — reducing fear, grief, or hostility.
This may shift their behavior or unlock new dialog options. On failure, the gesture lands wrong.

#### Dialogs
- On a successful check, you find the emotional register that makes your interlocutor feel genuinely heard.
Extra dialog lines appear, often revealing things they would not say to someone they didn't trust.
On failure, the connection doesn't form.

---

## Mind / Body

### SKILL_MEDICINE
Diagnosing and treating injury and disease through knowledge and hands. Stabilizing the dying, setting bones,
identifying poisons, performing surgery under conditions no surgeon should ever face. Knowledge is useless without
the steadiness to apply it.

#### Commands
- /diagnose : On a successful check, you identify the specific condition affecting a creature — disease type, poison,
injury severity, or systemic failure. The result tells you which treatment applies.
- /treat : On a successful check, you remove a disease or neutralize a poison in yourself or a nearby character.
Requires a medical kit or appropriate materials.
- /stabilize : On a successful check, you prevent a dying character from bleeding out, buying time without restoring
hitpoints. On failure, the bleeding continues.

### SKILL_ALCHEMY
Transforming raw materials into substances with useful properties — poisons, medicines, explosives, acids, reagents.
Part chemistry, part intuition, part willingness to handle things that can kill you if you make a mistake.

#### Commands
- /brew : On a successful check, you combine ingredients from your inventory into a potion, poison, or compound.
On failure, the materials are wasted — or the result is something you didn't intend.
- /analyze : On a successful check, you identify the composition and effect of an unknown substance, liquid, or residue.

---

## Mind / Sense

### SKILL_LOCKPICKING
Opening locks without the key, through understanding of mechanisms and sensitivity of touch.
Patience, knowledge of how things are built, and the ability to feel information through metal.
Also useful for other fine manipulation tasks that require both thought and precision.

#### Commands
- /pick : On a successful check, you open a locked door or container without a key. On failure, you may snap your
picks, jam the mechanism, or trigger an alarm.
- /tinker : On a successful check, you manipulate a small mechanical device — disabling a latch, adjusting a
component, bypassing a simple security mechanism without forcing it.

### SKILL_PRECISION_CRAFTING
Creating objects that require exactness — weapons, mechanisms, instruments, inscriptions, circuitry.
The mind designs; the hands execute without error.
A failed joint or a miscalculated tolerance can mean the difference between a tool and a trap.

#### Commands
- /craft : On a successful check, you fabricate a weapon component, tool, or precise mechanism from raw materials
in your inventory. The quality scales with the margin of success.
- /repair : On a successful check, you restore a damaged or broken item to working condition, recovering its stats.
On failure, the item's condition worsens.

---

## Mind / Mind

### SKILL_ARCANA
Understanding magic as a system — its rules, its history, its failures, its costs.
Identifying spells, reading magical writing, understanding what a ritual was designed to do and what
went wrong when it didn't. Magic is not wonder here. It is a language, and this skill is literacy.

#### Passive
- You automatically recognize magical auras, identify schools of magic, and understand the general nature of
magical effects when you observe them. No check required — only the knowledge to interpret what you see.

#### Commands
- /identify : On a successful check, you discern the magical properties of an unknown item or effect. On failure,
the item remains unidentified and you know you failed, which is its own information.
- /read : On a successful check, you decipher magical writing, glyphs, ritual inscriptions, or runic sequences.

#### Dialogs
- On a successful check, extra dialog lines appear with mages, scholars, or magical entities — engaging them in the
language of their craft, revealing deeper lore, or negotiating in terms they respect.

### SKILL_TECHNOLOGY
Understanding machines, systems, and the principles behind them. Repairing, modifying, building, diagnosing.
From clockwork to combustion engines to things that hum with energies that have no good name yet.
In futuristic times, this skill includes the ability to handle advanced technology and systems
like computers or security network.
The world runs on mechanisms. This skill is knowing how.

#### Commands
- /hack : On a successful check, you bypass an electronic lock, security panel, or networked system.
On failure, an alert may be triggered or the system locks you out.
- /repair : On a successful check, you restore a broken mechanical or electronic device to functionality.
- /interface : On a successful check, you operate unfamiliar technology — extracting data, activating systems,
or navigating interfaces without triggering safeties.

---

## Mind / Presence

### SKILL_PERSUASION
Changing minds through argument — presenting evidence, constructing reasoning, finding the frame that
makes your position feel inevitable. Unlike Deception, Persuasion works best when you're telling the truth.
Unlike Manipulation, it respects the target's ability to think.

#### Dialogs
- On a successful check, you present a compelling argument that shifts your interlocutor's position. Extra dialog
lines appear. On failure, they remain unconvinced — and may grow irritated at being handled.

### SKILL_NEGOTIATION
Finding agreements between parties with conflicting interests. Identifying what each side actually needs
beneath what they say they want, and constructing deals that hold. Useful in commerce, diplomacy,
and situations where the alternative is violence.

#### Commands
- /barter : On a successful check, you negotiate better terms in a trade — lower prices, higher sell values,
or improved exchange rates. On failure, the merchant holds firm and marks you as someone who tries.

#### Dialogs
- On a successful check, you identify the real need beneath your interlocutor's stated position. Extra dialog
lines appear that propose arrangements neither side had considered, and which may benefit both.

---

## Presence / Body

### SKILL_LEADERSHIP
Making people follow you into situations they would not enter alone. Not through argument or fear
but through something harder to name — the sense that you know what you're doing and that following
you is the right choice. Often wrong, but convincing.

#### Commands
- /rally : On a successful check, you inspire nearby allies — temporarily boosting their attack bonus and
preventing flight. On failure, the gesture falls flat and costs you nothing but the moment.

#### Dialogs
- On a successful check, extra dialog lines appear that let you take command of a situation — directing
guards, organizing a group, or resolving a standoff without argument. People do what you say because
it sounds like the obvious thing to do.

### SKILL_MORALE
Sustaining the will to continue under pressure — in yourself and in others.
Recognizing when a group is about to break and knowing what to say or do to hold it together.
In a dark world, this is not an optimistic skill. It is a desperate one.

#### Passive
- Allies within your presence have a reduced chance of fleeing or breaking under fear effects.
The duration of fear and demoralization debuffs is shortened.

#### Commands
- /inspire : On a successful check, you restore morale to a frightened or demoralized ally, removing the fear
debuff and their willingness to continue fighting. On failure, your words don't reach them.

---

## Presence / Sense

### SKILL_STREETWISE
Navigating the social ecosystems of cities, underworlds, and communities built on things that aren't
written down. Knowing who to talk to, how to ask without asking, what you can say and what will get you killed.
Belonging, or performing it well enough.

#### Commands
- /inquire : On a successful check in an inhabited area, you locate a specific person, a fence, a black-market
contact, or a hidden establishment. On failure, you draw the wrong kind of attention instead of information.

#### Dialogs
- On a successful check with underworld or street-level NPCs, extra dialog lines appear that signal you know the
local code — who to trust, what not to say, and how to ask for things that aren't on the menu.

### SKILL_DISGUISE
Becoming someone else — through costume, mannerism, voice, context. Less about the costume than about
the commitment. A disguise fails when the person wearing it stops believing in it.

#### Commands
- /disguise : On a successful check, you assume a new identity using available materials. NPCs treat you according
to the role you've built until something breaks the illusion. On failure, something is immediately off.
- /blend : On a successful check, you adjust your bearing and manner to disappear into a crowd or context,
becoming effectively invisible to casual observation without requiring full disguise materials.

---

## Presence / Mind

### SKILL_DECEPTION
Making people believe things that are not true. Lying well requires knowing what the target wants to
believe and giving it to them in a form they can accept. The best lies are mostly true.

#### Commands
- /bluff : On a successful check, you convince an NPC or enemy that something false is true — creating a
distraction, denying involvement, or redirecting suspicion. On failure, the deception is visible and
your credibility for this encounter is gone.

#### Dialogs
- On a successful check, you deliver a convincing lie. Extra dialog lines appear. On failure, the deception
is detected and your interlocutor's disposition worsens, sometimes to the point of hostility.

### SKILL_POLITICS
Understanding and operating within systems of power — who owes whom, who wants what, where the pressure points are,
how decisions are actually made beneath the formal structure. Useful wherever there are people with competing interests
and something at stake.

#### Passive
- You automatically recognize faction affiliations, political ranks, and the implied leverage in a room.
NPCs in positions of power are briefly annotated with what they want and who they fear.

#### Dialogs
- On a successful check, extra dialog lines appear with authority figures, nobles, or officials — revealing the
underlying motivations and pressure points that a politically illiterate character would never think to press.

---

## Presence / Presence

### SKILL_FAITH
Absolute conviction in something larger than the self — a god, a principle, a cause, a necessary lie.
In a world this dark, faith is not comfort. It is armor. It is also, occasionally, a weapon.
The mechanical effect is real regardless of whether the object of faith is.

#### Passive
- Resistance to fear, despair, and corruption-based magical effects. The strength scales with how much
the conviction has actually cost you — passive faith bought cheaply offers passive protection.

#### Commands
- /pray : On a successful check, you invoke your faith for real intervention — restoring a small amount of vigor,
lifting a curse, or gaining a temporary resistance bonus. Cannot be used repeatedly without meaning.
Each prayer costs something, even when it works.

#### Dialogs
- On a successful check with clergy, believers, or entities connected to your faith, extra dialog lines appear
that acknowledge shared conviction and open options unavailable to those without it.

### SKILL_AURA
The raw projection of self into a space — the quality that makes a room change when you enter it.
Not charisma exactly. Something older. Some people have it without knowing. Some spend their lives learning to manufacture it.
Either way, others feel it before they understand why.

#### Passive
- Your presence is felt before you speak. NPCs in the room react to your entry — hostiles may hesitate,
neutrals turn attentive. This is not checked; it is always active and cannot be switched off.

#### Commands
- /presence : On a successful check, you project your aura deliberately — silencing a room, commanding
attention, or suppressing a tense situation before it becomes violence. On failure, the moment passes
and the room reads your attempt for what it was.

#### Dialogs
- On a successful check, your bearing alone opens dialog options that would otherwise require specific social
skill use. Some NPCs respond to what you are before they respond to what you say.
