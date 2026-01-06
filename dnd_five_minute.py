#!/usr/bin/env python3
import random
import textwrap

def roll_die(sides=20):
    return random.randint(1, sides)


def print_wrapped(text):
    print(textwrap.fill(text, width=78))


def choose(prompt, options):
    while True:
        print_wrapped(prompt)
        for key, label in options.items():
            print(f"  [{key}] {label}")
        choice = input("> ").strip().lower()
        if choice in options:
            return choice
        print("Please choose one of the listed options.\n")


def build_character():
    print_wrapped(
        "Welcome to the Five-Minute D&D Adventure! Choose a hero archetype."
    )
    options = {
        "f": "Fighter (steady damage, can shrug off one bad roll)",
        "r": "Rogue (extra damage on stealthy choices)",
        "m": "Mage (can reroll a spell once per game)",
    }
    choice = choose("Pick your hero:", options)
    if choice == "f":
        return {"name": "Fighter", "boon": "guard", "reroll": False}
    if choice == "r":
        return {"name": "Rogue", "boon": "sneak", "reroll": False}
    return {"name": "Mage", "boon": "spell", "reroll": True}


def resolve_check(hero, difficulty, bonus=0, allow_reroll=False):
    roll = roll_die()
    total = roll + bonus
    if allow_reroll and hero["reroll"] and total < difficulty:
        print("Your arcane focus hums. You may reroll once!")
        hero["reroll"] = False
        roll = roll_die()
        total = roll + bonus
    print(f"You roll a d20: {roll} (total {total} vs {difficulty}).")
    return total >= difficulty


def encounter_one(hero):
    print_wrapped(
        "A ruined watchtower blocks the forest path. A goblin lookout peers down."
    )
    options = {
        "a": "Charge the stairs",
        "b": "Sneak through the brush",
        "c": "Cast a distracting cantrip",
    }
    choice = choose("How do you handle the lookout?", options)
    bonus = 2 if choice == "a" and hero["name"] == "Fighter" else 0
    bonus += 3 if choice == "b" and hero["name"] == "Rogue" else 0
    bonus += 3 if choice == "c" and hero["name"] == "Mage" else 0
    success = resolve_check(hero, 12, bonus, allow_reroll=(choice == "c"))
    if success:
        print_wrapped(
            "You slip past the goblin and find a pouch of healing herbs. Gain 1 boon."
        )
        return 1
    print_wrapped(
        "The goblin spots you, and the alarm is raised. You lose time and courage."
    )
    return -1


def encounter_two(hero):
    print_wrapped(
        "A rickety bridge spans a chasm. The ropes creak with every step."
    )
    options = {
        "a": "Cross carefully",
        "b": "Dash across",
        "c": "Find a safer route",
    }
    choice = choose("What is your approach?", options)
    bonus = 2 if choice == "a" and hero["name"] == "Fighter" else 0
    bonus += 2 if choice == "b" and hero["name"] == "Rogue" else 0
    bonus += 2 if choice == "c" and hero["name"] == "Mage" else 0
    success = resolve_check(hero, 13, bonus)
    if success:
        print_wrapped(
            "You cross safely and spot a glinting gem lodged in the planks."
        )
        return 1
    print_wrapped(
        "You stumble, losing your pack. It's gone into the depths."
    )
    return -1


def encounter_three(hero):
    print_wrapped(
        "A wounded wolf blocks the trail, growling yet limping."
    )
    options = {
        "a": "Calm it with rations",
        "b": "Threaten it away",
        "c": "Heal it with magic",
    }
    choice = choose("How do you deal with the wolf?", options)
    bonus = 2 if choice == "a" and hero["name"] == "Fighter" else 0
    bonus += 3 if choice == "b" and hero["name"] == "Rogue" else 0
    bonus += 4 if choice == "c" and hero["name"] == "Mage" else 0
    success = resolve_check(hero, 11, bonus, allow_reroll=(choice == "c"))
    if success:
        print_wrapped(
            "The wolf calms and pads away, revealing a hidden cache of coins."
        )
        return 1
    print_wrapped(
        "The wolf snaps and you withdraw, losing precious time."
    )
    return -1


def encounter_four(hero):
    print_wrapped(
        "You enter the ruined shrine. An enchanted door bars the relic chamber."
    )
    options = {
        "a": "Force it open",
        "b": "Pick the lock",
        "c": "Decipher the runes",
    }
    choice = choose("How do you breach the door?", options)
    bonus = 3 if choice == "a" and hero["name"] == "Fighter" else 0
    bonus += 3 if choice == "b" and hero["name"] == "Rogue" else 0
    bonus += 3 if choice == "c" and hero["name"] == "Mage" else 0
    success = resolve_check(hero, 14, bonus)
    if success:
        print_wrapped(
            "The door yields. Inside, you find the relic on a pedestal."
        )
        return 1
    print_wrapped(
        "The door resists. You lose momentum and feel the pressure of time."
    )
    return -1


def encounter_five(hero, score):
    print_wrapped(
        "The relic is guarded by a spectral knight who demands a final challenge."
    )
    options = {
        "a": "Duel with honor",
        "b": "Outwit with a feint",
        "c": "Channel raw magic",
    }
    choice = choose("What is your final gambit?", options)
    bonus = 4 if choice == "a" and hero["name"] == "Fighter" else 0
    bonus += 4 if choice == "b" and hero["name"] == "Rogue" else 0
    bonus += 4 if choice == "c" and hero["name"] == "Mage" else 0
    difficulty = 12 + max(0, 2 - score)
    success = resolve_check(hero, difficulty, bonus, allow_reroll=(choice == "c"))
    if success:
        print_wrapped(
            "The knight salutes and lets you pass. You claim the relic and escape!"
        )
        return True
    print_wrapped(
        "The knight blocks your path. You flee with your life, but not the relic."
    )
    return False


def main():
    random.seed()
    hero = build_character()
    print_wrapped(f"You are the {hero['name']} on a five-minute quest.")
    print()

    score = 0
    score += encounter_one(hero)
    print()
    score += encounter_two(hero)
    print()
    score += encounter_three(hero)
    print()
    score += encounter_four(hero)
    print()

    print_wrapped(f"Your momentum score is {score}. The finale begins.")
    print()
    victory = encounter_five(hero, score)

    print()
    if victory:
        print_wrapped(
            "Victory! Your story spreads through the taverns. Thanks for playing."
        )
    else:
        print_wrapped(
            "Defeat, but not disgrace. Rest up and try the adventure again."
        )


if __name__ == "__main__":
    main()
