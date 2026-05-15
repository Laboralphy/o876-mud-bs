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
- On a successful check, some extra dialog lines appear, and you can safely seduce your interlocutor. On failure,
the dialog line does not appear.

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

- /search : On a successful check,

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

### SKILL_TRAP_DETECTION
Reading an environment for things designed to hurt you. Pressure plates, tripwires, poisoned handles, collapsing floors,
magical wards. Experience and paranoia, formalized into a method.

---

## Sense / Presence

### SKILL_INSIGHT
Reading people — their intentions, their emotional state, the gap between what they say and what they mean.
Not empathy exactly. More like pattern recognition applied to human behavior. Cold, accurate, occasionally unsettling.

### SKILL_EMPATHY
Feeling what others feel, or at least modeling it closely enough to respond to it. Useful for negotiation, comfort, manipulation.
The difference between Insight and Empathy is that Insight observes from outside.
Empathy steps inside, briefly, and looks around.

---

## Mind / Body

### SKILL_MEDICINE
Diagnosing and treating injury and disease through knowledge and hands. Stabilizing the dying, setting bones,
identifying poisons, performing surgery under conditions no surgeon should ever face. Knowledge is useless without
the steadiness to apply it.

### SKILL_ALCHEMY
Transforming raw materials into substances with useful properties — poisons, medicines, explosives, acids, reagents.
Part chemistry, part intuition, part willingness to handle things that can kill you if you make a mistake.

---

## Mind / Sense

### SKILL_LOCKPICKING
Opening locks without the key, through understanding of mechanisms and sensitivity of touch.
Patience, knowledge of how things are built, and the ability to feel information through metal.
Also useful for other fine manipulation tasks that require both thought and precision.

### SKILL_PRECISION_CRAFTING
Creating objects that require exactness — weapons, mechanisms, instruments, inscriptions, circuitry.
The mind designs; the hands execute without error.
A failed joint or a miscalculated tolerance can mean the difference between a tool and a trap.

---

## Mind / Mind

### SKILL_ARCANA
Understanding magic as a system — its rules, its history, its failures, its costs.
Identifying spells, reading magical writing, understanding what a ritual was designed to do and what
went wrong when it didn't. Magic is not wonder here. It is a language, and this skill is literacy.

### SKILL_TECHNOLOGY
Understanding machines, systems, and the principles behind them. Repairing, modifying, building, diagnosing.
From clockwork to combustion engines to things that hum with energies that have no good name yet.
In futuristic times, this skill includes the ability to handle advanced technology and systems
like computers or security network.
The world runs on mechanisms. This skill is knowing how.

---

## Mind / Presence

### SKILL_PERSUASION
Changing minds through argument — presenting evidence, constructing reasoning, finding the frame that
makes your position feel inevitable. Unlike Deception, Persuasion works best when you're telling the truth.
Unlike Manipulation, it respects the target's ability to think.

### SKILL_NEGOTIATION
Finding agreements between parties with conflicting interests. Identifying what each side actually needs
beneath what they say they want, and constructing deals that hold. Useful in commerce, diplomacy,
and situations where the alternative is violence.

---

## Presence / Body

### SKILL_LEADERSHIP
Making people follow you into situations they would not enter alone. Not through argument or fear
but through something harder to name — the sense that you know what you're doing and that following
you is the right choice. Often wrong, but convincing.

### SKILL_MORALE
Sustaining the will to continue under pressure — in yourself and in others.
Recognizing when a group is about to break and knowing what to say or do to hold it together.
In a dark world, this is not an optimistic skill. It is a desperate one.

---

## Presence / Sense

### SKILL_STREETWISE
Navigating the social ecosystems of cities, underworlds, and communities built on things that aren't
written down. Knowing who to talk to, how to ask without asking, what you can say and what will get you killed.
Belonging, or performing it well enough.

### SKILL_DISGUISE
Becoming someone else — through costume, mannerism, voice, context. Less about the costume than about
the commitment. A disguise fails when the person wearing it stops believing in it.

---

## Presence / Mind

### SKILL_DECEPTION
Making people believe things that are not true. Lying well requires knowing what the target wants to
believe and giving it to them in a form they can accept. The best lies are mostly true.

### SKILL_POLITICS
Understanding and operating within systems of power — who owes whom, who wants what, where the pressure points are,
how decisions are actually made beneath the formal structure. Useful wherever there are people with competing interests
and something at stake.

---

## Presence / Presence

### SKILL_FAITH
Absolute conviction in something larger than the self — a god, a principle, a cause, a necessary lie.
In a world this dark, faith is not comfort. It is armor. It is also, occasionally, a weapon.
The mechanical effect is real regardless of whether the object of faith is.

### SKILL_AURA
The raw projection of self into a space — the quality that makes a room change when you enter it.
Not charisma exactly. Something older. Some people have it without knowing. Some spend their lives learning to manufacture it.
Either way, others feel it before they understand why.
