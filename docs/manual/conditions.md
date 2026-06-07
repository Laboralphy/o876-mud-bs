# Conditions

A condition is an affliction imposed on a creature by magic, venom, trauma, or supernatural force. Each condition
alters what a creature can do — sometimes subtly, sometimes completely. Conditions are temporary by nature;
most are bound to an effect that expires, can be dispelled, or fades when its source is removed.

Some creatures are **immune** to a condition. An immunity is absolute: the condition cannot be applied at all,
regardless of its source or power. No saving throw is required, no partial effect lingers. The affliction simply
finds no purchase.

---

## Charm

*"The blade felt heavy in my hand. Why would I raise it against him? He was my friend. He had always been my
friend. Hadn't he?"*

A charmed creature's loyalty is stolen. It regards the charmer as a trusted ally and will not act against its
interests — it will not attack the charmer, will not willingly support the charmer's enemies, and may follow
suggestions it would otherwise refuse. The charmed creature is not mindless; it retains its personality and
memories. It simply cannot see the charmer clearly.

**Mechanical effects:** The charmed creature cannot fight the charmer. The exact scope of compelled behaviour
is determined by the program that applied the charm.

**Immunity:** A creature immune to charm cannot have its allegiance magically redirected. Enchantment finds
no lever to pull. This does not make the creature emotionless — only that its will cannot be seized by
magical means. *Typically possessed by undead, constructs, and creatures without a true mind.*

---

## Disease

*"It started with a cough. Three days later he could not lift his sword arm."*

Disease is a condition that worsens over time. Rather than a single debilitating blow, it is a slow siege —
progressing through stages, each more punishing than the last. Each stage may deal periodic damage, impose
penalties, or strip away capabilities. At the boundary between stages the afflicted creature may attempt to
fight off the infection; failure means the disease advances. Success, or reaching the final stage, ends it.

**Mechanical effects:** Varies by disease and stage. Penalties, periodic damage, and skill modifiers are
applied as conveyed effects by the disease program. See individual disease entries for specifics.

**Immunity:** A creature immune to disease cannot be infected, natural or magical. Contagion spreads no
further. The biology simply does not support it. *Typically possessed by undead, constructs, and elementals.*

---

## Fear

*"It was not cowardice. Something older than reason took hold and turned her legs toward the door."*

A frightened creature is seized by supernatural terror. Its instincts override its will. It cannot bring
itself to fight — not because it is physically restrained, but because the compulsion to flee or to
cower is overwhelming. A frightened creature can still move, still think, still speak. It simply cannot
face what frightens it.

**Mechanical effects:** A frightened creature cannot fight (`canFight = false`). It may still move and take
other actions.

**Immunity:** A creature immune to fear feels no supernatural dread. It may be reckless, it may be
programmed, it may simply have nothing left to lose — but magical terror cannot break its resolve.
*Typically possessed by undead, mindless constructs, and creatures of pure instinct or rage.*

---

## Paralysis

*"She was conscious for all of it. She simply could not move."*

A paralyzed creature is locked inside itself. Muscles seize, limbs stop answering, breath becomes shallow
and difficult. The mind may still be sharp — aware of everything happening around it — but the body has
become a prison. Paralysis is among the most dangerous conditions precisely because it leaves the victim
helpless while fully aware.

**Mechanical effects:** A paralyzed creature cannot move, fight, or take any action (`canMove`, `canFight`,
and `canAct` are all false).

**Immunity:** A creature immune to paralysis continues to act regardless of nerve-seizing magic or venom.
Its body does not obey the mechanism that paralysis exploits — whether because it has no nerves, no
muscles in the conventional sense, or is simply held together by something other than biology.
*Typically possessed by undead, constructs, and oozes.*

---

## Petrification

*"The process took about six seconds. The expression on his face was surprise."*

Petrification transforms living flesh into inert stone — or some equivalent rigid substance. The creature
is neither dead nor alive in any meaningful sense. It cannot move, cannot act, cannot be harmed by most
means, and cannot be healed. It simply exists, frozen at the moment the transformation completed.

**Mechanical effects:** A petrified creature cannot move, fight, or take any action (`canMove`, `canFight`,
and `canAct` are all false). The condition persists until reversed by magic or the effect expires.

**Immunity:** A creature immune to petrification cannot be transmuted into stone. Its form resists the
transformation entirely, whether through magical protection, an alien physiology, or some property of
its substance that simply defies lithification. *Typically possessed by creatures already composed of
stone or metal, certain undead, and entities outside normal biology.*

---

## Poison

*"The wound itself was nothing. What it carried was something else."*

Poison works from the inside out. Whether delivered by fang, blade, or cloud, a toxic substance enters
the bloodstream and begins its work — dealing damage at regular intervals, wearing the body down over
time. Some poisons are merely painful; others are methodically lethal. Unlike disease, poison does not
typically progress through stages: it simply keeps dealing damage until it is purged or runs its course.

**Mechanical effects:** A poisoned creature suffers periodic damage for the duration of the effect.
Damage type and amount depend on the specific poison applied.

**Immunity:** A creature immune to poison cannot be harmed by venom, toxin, or poisonous gas. Its blood
does not carry poison to vital organs — or it has no vital organs to poison — or its constitution is so
extreme that even magical toxins are neutralised on contact. *Typically possessed by undead, constructs,
and elementals.*

---

## Root

*"Her feet were her own. The ground, however, was not cooperating."*

A rooted creature is anchored in place — unable to change its position, to charge, to retreat, or to
close distance. It retains full control of its mind and body in every other respect. It can swing a sword,
cast a spell, shout commands. It simply cannot go anywhere. Rooting is often used to prevent a target
from escaping, or to hold a powerful creature at a fixed point where it becomes predictable.

**Mechanical effects:** A rooted creature cannot move (`canMove = false`). It retains the ability to
fight and act normally.

**Immunity:** A creature immune to root cannot be magically anchored. Effects that would pin it to the
ground find no grip. *Typically possessed by incorporeal creatures and entities with no fixed physical form.*

---

## Stun

*"The blow rang through his skull like a struck bell. The next few seconds were missing entirely."*

A stunned creature is momentarily overwhelmed — its thoughts scattered, its reflexes gone, its body
unresponsive. The cause may be physical (a crushing blow to the head), magical (a concussive wave of
force), or alchemical. Whatever the source, the result is the same: for a moment the creature is
completely unable to act, move, or defend itself.

**Mechanical effects:** A stunned creature cannot move, fight, or take any action (`canMove`, `canFight`,
and `canAct` are all false).

**Immunity:** A creature immune to stun cannot be dazed or rendered momentarily helpless. Concussive
blows, scrambling spells, and shock effects simply do not produce the stunned condition. *Typically
possessed by constructs, certain undead, and creatures with distributed or alien nervous systems.*

---

## Ability Drain

*"She still stood. She still swung. The sword was just… heavier than it had been."*

Ability drain strips away one of a creature's core attributes — Body, Senses, Mind, or Presence — for a
duration. The lost points reduce every derived value that flows from that ability: hit points, attack bonus,
armor class, skill checks. The creature still functions, but at a diminished version of itself. The drain is
temporary; the ability returns when the effect expires.

**Mechanical effects:** A negative modifier is applied to a specific ability score for the duration. All
stats derived from that ability are recalculated immediately.

**Resistance:** Resisted at the moment of application by an ability check. The defending ability depends on
the nature of the attack: Presence counters supernatural drains, Body counters extraordinary, Mind counters
magical, Senses counters weapon-delivered drains.

*There is no immunity to ability drain.*

---

## Attack Drain

*"He was a capable fighter. Watching him miss three times in a row, you had to wonder what had changed."*

Attack drain dulls the precision and force behind a creature's strikes — not through injury, but through a
debilitating effect that saps combat effectiveness directly. The creature attacks as often, moves as freely,
but lands blows less reliably. The penalty applies to all attacks for the duration.

**Mechanical effects:** A flat penalty is applied to attack bonus for the duration. Affects both melee and
ranged attack rolls.

**Resistance:** Resisted at the moment of application by an ability check, using the same subtype-to-ability
mapping as ability drain.

*There is no immunity to attack drain.*

---

## Armor Class Drain

*"The armor was still on. It just didn't seem to matter as much anymore."*

Armor class drain reduces a creature's effective defenses without removing its equipment or wounding it. The
creature becomes easier to hit — its movements slower to read, its guard easier to break. As with other
drains, this fades when the effect expires.

**Mechanical effects:** A flat penalty is applied to armor class for the duration. Affects all incoming
attacks.

**Resistance:** Resisted at the moment of application by an ability check, using the same subtype-to-ability
mapping as ability drain.

*There is no immunity to armor class drain.*

---

## Blindness

*"Darkness is something you can adjust to. This was not darkness. This was absence."*

A blinded creature cannot see. Whether its eyes are sealed by magic, burned away by light, or simply
made useless by an impenetrable shroud, the result is disorientation, difficulty targeting enemies, and
vulnerability to attacks it cannot see coming.

**Mechanical effects:** Blindness affects visibility-based calculations — attack accuracy and the ability
to detect hidden or invisible targets. Specific penalties are applied by the effect program.

**Immunity:** A creature immune to blindness cannot have its sight magically extinguished. It may not
even rely on conventional sight — navigating instead by tremorsense, blindsight, magical perception,
or some other sense that the blindness condition simply does not reach.
*Typically possessed by creatures that navigate without eyes.*

---

## Critical Hit Immunity

*"You can hit it precisely. It does not matter."*

This is not strictly a condition — it is a property of certain creatures that lack the discrete anatomy
a skilled attacker normally exploits. There are no arteries to sever, no joints to shatter, no organs
to puncture. Every blow is anatomically equivalent. A roll of 20 on the attack die still connects — but
it does no more damage than any other hit, and the automatic-hit rule does not apply.

**Immunity:** A roll of 20 is treated as a normal attack roll, subject to the target's armour class.
Critical damage bonuses are not applied. *Typically possessed by oozes, elementals, constructs, and
undead without discrete anatomy.*

---

## Sources of Immunity

An immunity can come from three sources:

- **Innate property** — part of the creature's fundamental nature, present at creation. A skeleton does
  not become immune to disease; it simply is, and always was.
- **Equipment property** — a magic item worn or wielded that confers the immunity while equipped.
  Remove the item, lose the protection.
- **Active effect** — a spell or ability currently running on the creature. The immunity lasts only as
  long as the effect does. A paladin's protection, a potion of poison resistance taken too literally —
  temporary, but real while it holds.

When multiple sources grant the same immunity, only one is needed. Losing one source does not remove
the immunity if another source remains active.
