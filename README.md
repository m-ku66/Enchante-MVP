# Enchante - Game Design Document

## Game Overview

**Enchante** is a strategic card game featuring magical gamblers who compete in high-stakes duels using their luck as their life force. Players must balance risk and reward through betting mechanics while managing their hand of cards to defeat their opponent.

### Core Theme

* **Setting**: Mystical gambling halls and magical casinos
* **Aesthetic**: European poker/gambling meets fantasy magic
* **Characters**: Magical card sharks and fortune-tellers with unique abilities

## Basic Game Components

### Player Resources

* **Luck Points**: Player's health/life force (starting amount depends on character type)
* **Hand**: Cards held by the player (starting hand size 7)
* **Coins**: Currency for betting mechanics (starting amount 500; max limit per player 1000. There's a 10,000 coin pool that all players can gain from)
* **Character**: Chosen avatar with unique abilities and color affinity(Red, Blue, Yellow, Green)

## Character System

Card sharks, fortune tellers, all professions gambling and magical in nature. Characters have affinities, basic stats, passive abilities and special skills that can be used in games to affect gameplay.

### Character Abilities

* **Color Affinity**: Each character has a signature color for bonus effects and stats
* **Passives**: Special rules or abilities that modify gameplay(typically relating to suits but not always)
* **Special Skill**: Unique abilities that play well into a character's play style

### Character Stats

* **Luck**: How much damage your character can take before losing the game; basically HP
  
* **Ego**: How much damage is subtracted from incoming attacks; basically DP
  
* **Charm**: Probability of landing critical discards; basically CRIT(x1.5 damage)
  

### Character Affinities

Inherent color type associated with a character that affects various aspects of how they play. There are four affinities:

* **Red**: High damage bonuses for successful betting(+10%); low ego + high charm typically(Glass Cannon)
  
* **Blue**: High defense bonuses for betting(+10%); low charm + high ego typically(Turtle)
  
* **Yellow**: Recieve +25% more coins from all coin recieving actions; low luck typically(Opportunist)
  
* **Green**: Recieve -25% more coins from all coin recieving actions; High luck typically(Luck Tank)
  

### Example Character Concepts

* Characters that get increased charm at low luck
* Characters that can sacrifice luck for coins
* Characters with enhanced betting bonuses
* Characters with color-specific advantages

### Card Types

* **Standard Cards**: Numbered cards (1-7) in different colors(red, blue, yellow, green) and suits(spades, hearts, diamonds, clubs). Deal dmg
* **Special Cards**: Cards with unique effects on discard that don't deal dmg

The game's card deck has 119 cards total minus 1 for the first card in the discard pile and minus 7 for the hands of each player(104 in draw pile)

* **Red**
  
  * Hearts(cards 1-7)
    
  * Diamonds(cards 1-7)
    
  * Clubs(cards 1-7)
    
  * Spades(cards 1-7)
    
* **Blue**
  
  * Hearts(cards 1-7)
    
  * Diamonds(cards 1-7)
    
  * Clubs(cards 1-7)
    
  * Spades(cards 1-7)
    
* **Yellow**
  
  * Hearts(cards 1-7)
    
  * Diamonds(cards 1-7)
    
  * Clubs(cards 1-7)
    
  * Spades(cards 1-7)
    
* **Green**
  
  * Hearts(cards 1-7)
    
  * Diamonds(cards 1-7)
    
  * Clubs(cards 1-7)
    
  * Spades(cards 1-7)
    
* **Special**
  
  * King(x2): Costs 50 coins to discard. Functions like a wildcard from UNO. Allows the player to set the color and suit of the discard pile's top-most card(Decree)
    
  * Queen(x2): Costs 50 coins to discard. Functions like a skip. Skip opponent's turn(Majesty)
    
  * Joker(x2):Costs 50 coins to discard. Swap 3 random cards with an opponent player(Trick)
    
  * Ace(x1): Costs 100 coins to discard. When discarded/played, the player has to draw from the draw pile after guessing what the color will be. If correct, multiplies the damage of the drawn card by 3(card is marked); if wrong, the opponent player has their next discard's damage multiplied by 3 for damage. If the card is a special card, the player discards it immediately and gains 100 coins(Wager)
    

## Core Gameplay Loop

### Turn Structure

Each turn, players can choose to EITHER:

1. **Draw** cards from the draw pile and **BET** to potentially boost ego
2. **Discard** cards from their hand to deal damage and **INVEST** coins to deal extra damage

**Speculate** the value of an incoming attack to stabilize the game and potentially restore luck as another option that works in tandem with these

### Drawing Mechanics

* Players draw from a central draw pile
* **Betting Option**: Before drawing, bet coins on the color OR suit of the drawn card
  * **Correct Guess(color)**: Ego increase by coins bet for x turns(where x is the increment level of the bet) + 50 coins from coin pool
  * **Correct Guess(suit)**: Immediately discard the drawn card with bonus damage (based on coins bet) + 100 coins from coin pool
  * **Wrong Guess**: Reduce ego by coins bet for 1 turn
  * **Special Card**: Discard the card immediately. No reward or penalty

### Discarding/Attack Mechanics

* Discarding a card deals damage equal to the card's number; every discard ACTION has a chance to crit based on the character's charm stat
* **Investment Option**
  * **Effect**: When discarding, players can invest coins into their discard action in order to increase the damage of the discard. For example, investing 50 coins into an attack will boost the attack's damage by 50%(attack damage + 50% of attack damage)
  * **Drawback**: The downside to investing is that the character of the player will have their ego reduced to 0 for x amount of turns(where x is equal to the increment level of coins invested. So investing 50 coins = ego reduced to 0 for 2 turns)
* **Affinity Bonus**: If discarded card matches your character's color, gain attack bonus(x1.2)
* Discarded cards go to the discard pile; Only cards of the same color or suit can be discarded to the discard pile. Players can stack cards of the same suit(not color) in their hand to discard multiple cards at once(max is 3 and this is treated as one action/discard). Special cards can be discarded into the pile regradless of the current color/suit and CANNOT be stacked; with each other or with standard cards
* If you discard a **perfect match**(your discarded card matches the color and suit of the top-most card in discard pile), you gain 100 coins from the coin pool on discard

#### Speculation Mechanics

* This is a neutral action made to balance the momentum of a game. When speculating, you're guessing the color/suit of an incoming attack
  
* **Speculation Option**: Bet coins on the color OR suit of the opponent's next attack
  
  * **Correct Guess(color)**: Restore luck by bet amount of max luck* + 100 coins from coin pool
  * **Correct Guess(suit)**: Restore luck by bet amount of max luck* + 200 coins from coin pool + your next attack is a guranteed critical(e.g boost charm to 100 for 1 turn)
  * **Wrong Guess**: Take increased damage on the incoming attack by coins bet

**The phrase "bet amount of max luck" means the percentage equivalent of the bet amount relative to the character's max luck. Ex: Your character has 100 luck as their base stat. Speculating 50 coins would yiled a restoration of 50 luck(50% of 100)*

### Betting/Investing

On actions that the player can bet/invest on/in, the maximum amount of coins they can bet/invest is 100 and coins can be bet/invested in 4 increments so 25, 50, 75, 100. Each increment can be treated as a percentage amount in terms of bonus effects, so if a player bets 100 coins on the card they draw from the draw pile being blue for example, their next attack will do 100% more damage if the guess is correct(double damage) or they'll take 100% more damage from their opponent's next attack if wrong. 25 coins = 25% and so on.

For all intents and purposes, special cards don't count as any color or suit. So any card can be discarded onto them when applicaple.

### Coin Pool

A pool of coins that starts at 10,000 coins, but can be depleted over the course of a game. The coin pool cannot be refilled in a game(unless a special card or character skill does it)

### Damage Calculation

Base damage → Affinity bonus → Crit bonus → Multipliers (like Ace, betting, etc.) → Extra effects like passives, etc. → Defense (Ego)

### Edge Cases

#### Crits and Stacking

If a player stacks cards and their stats allow them to crit on the discard, the crit damage is:

> collective damage of stacked cards x 1.5

So If I stacked:

* Red 3 of Hearts
  
* Blue 5 of Hearts
  
* Yellow 1 of Hearts
  

And got a crit on this action, the damage would be:

(3 + 5 + 1) x 1.5 = 13.5 → **14**

All discards, regardless of stacking, are treated as one damaging action!

#### Perfect Match Stacking

If a player somehow stacks 3 cards that all match the discard pile's top-most card in color and suit, the coin calculation looks like this:

> collective amount of coins gained per match x 0.5 x 1.5

So if I stacked 3 perfect matches, I'd get:

(100 + 100 + 100) x 0.5 x 1.5 = 225 coins

For 2 perfect matches:

(100 + 100) x 0.5 x 1.5 = 150 coins

#### Affinity Bonus Stacking

Works just like crit:

> collective damage of cards x 1.2 + number of cards in stack that match character affinity

So a stack of:

* Red 5 of Diamonds
  
* Green 6 of Diamonds
  
* Red 1 of Diamonds
  

Would tun out to be:

(5 + 6 + 1) x 1.2 + 2 = 16.4 → **17**

### Special Skill Ideas

* Add/remove coins from players(self/opponent)
* Ego buffs (reduce luck loss)
* Charm buffs (increase crit chance)
* Luck resotration
* Status effects based on card colors/suits
* Reveal cards in opponent hand
* Many more as the game continues development

## Win Conditions

### Game End Triggers

1. **Player Defeat**: A player's luck reaches 0
2. **Draw Pile Depleted**: If both players have the same luck when cards run out, it's a tie
3. **Timer**: If time runs out

### Victory

* Last player with luck remaining wins
* In case of tie, specific tie-breaking rules (TBD)

## Game Flow Example

1. **Setup**: Players choose characters, shuffle deck, deal starting hands, set starting coins. RNG to determine who's turn is first
2. **Turn Phase**: Player chooses to draw or discard(speculation is a special action that doesn't take a turn)
  * If drawing: Optional betting on card prediction; Calculate damage, apply affinity and stat bonuses
  * If discarding: Optional betting on opponent's next move; Calculate damage, apply affinity and stat bonuses
3. **Resolution**: Apply damage, special effects, betting outcomes
4. **Opponent Turn**: Repeat process
5. **Continue** until win condition met

## Design Goals

### Strategic Elements

* **Risk Management**: Balancing aggressive plays vs. conservative betting
* **Prediction**: Reading opponent patterns and card probabilities
* **Resource Management**: Balancing luck, coins, and hand size
* **Character Mastery**: Learning unique character abilities and synergies

### Monetization Features

* **Character Collection**: Unlock new characters with unique abilities
* **Character + Event Packs/DLC**: Premium characters or character bundles + story content
* **Cosmetic Options**: Card backs, game boards, character skins
* **Battle Pass**: Seasonal content with progression rewards

## Technical Considerations

### Single Player Focus

* AI opponents with varying difficulty levels
* Campaign mode with progressive challenges
* Character unlock progression
* Maybe multiplayer???

### Platform

* Desktop application (Electron-based for rapid development)
* Clean, responsive UI with card game aesthetics
* Smooth animations for card plays and effects

## General Development Phases

### Phase 1: Core Prototype

* [x] Basic game where the deck only has standard cards, but still follows all the stacking and discarding rules
  
* [x] No betting system yet. Players just either draw to add to their hand or discard to deal damage
  
* [x] Stats are still intact
  
* [x] AI enemy that performs actions
  
* [x] Game ends when either player reaches 0 luck
  
* [x] Simple damage calculation that doesn't take charm into account yet
  
* [x] character select phase, game phase, results phase
  

### Phase 2: Enhanced Systems

* [x] Consider charm for damage calculation(basically introduce crits)
* [x] Add betting with the basic mechanics
* [x] Troubleshoot discrepancy between damage formula and actual damage dealt in game via logs
* [x] Add special cards one by one
* [ ] Add more characters
* [ ] Polished UI/animations

### Phase 3: Content & Polish

* [ ] Campaign mode
* [ ] Character collection system
* [ ] Monetization implementation
* [ ] Final balancing and testing

## Notes & Questions for Development

### To Be Determined

* [ ] Specific character abilities and balancing
* [ ] How characters are collected
* [ ] Special card effects and distribution
* [ ] AI difficulty scaling
* [ ] Exact betting formulas and bonuses
* [ ] Timer/pressure mechanic details
* [ ] Multiplayer

### Next Steps

* [ ] Figure out game scope
* [ ] Create basic prototype with core mechanics
* [ ] Test fundamental gameplay loop
* [ ] Design initial character roster
* [ ] Develop basic AI opponent
* [ ] Iterate on balance and feel

Keep the AI simple for the prototype since it's mostly single file and focuses on core gameplay. Enhance it when you build the actual game


---
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
