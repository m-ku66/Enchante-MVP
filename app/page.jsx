"use client";
import { useState, useEffect, useCallback } from "react";

// Game constants
const COLORS = ["Red", "Blue", "Yellow", "Green"];
const SUITS = ["Hearts", "Diamonds", "Clubs", "Spades"];
const CARD_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

// Character definitions
const CHARACTERS = {
  "Crimson Jack": { affinity: "Red", luck: 80, ego: 2, charm: 50 },
  "Azure Sage": { affinity: "Blue", luck: 80, ego: 6, charm: 4 },
  "Golden Fox": { affinity: "Yellow", luck: 70, ego: 3, charm: 10 },
  "Jade Mystic": { affinity: "Green", luck: 120, ego: 3, charm: 10 },
  "Ruby Knight": { affinity: "Red", luck: 100, ego: 1, charm: 30 },
  "Sapphire Seer": { affinity: "Blue", luck: 60, ego: 7, charm: 10 },
  "Amber Archer": { affinity: "Yellow", luck: 70, ego: 2, charm: 15 },
  "Emerald Enchantress": { affinity: "Green", luck: 100, ego: 4, charm: 20 },
};

// Create deck with special cards
const createDeck = () => {
  const deck = [];

  // Add standard cards
  for (const color of COLORS) {
    for (const suit of SUITS) {
      for (const number of CARD_NUMBERS) {
        deck.push({
          color,
          suit,
          number,
          id: `${color}-${suit}-${number}`,
          type: "standard",
        });
      }
    }
  }

  // Add special cards
  deck.push({ id: "King-1", type: "King", color: null, suit: null, number: 0 });
  deck.push({ id: "King-2", type: "King", color: null, suit: null, number: 0 });
  deck.push({
    id: "Queen-1",
    type: "Queen",
    color: null,
    suit: null,
    number: 0,
  });
  deck.push({
    id: "Queen-2",
    type: "Queen",
    color: null,
    suit: null,
    number: 0,
  });
  deck.push({
    id: "Joker-1",
    type: "Joker",
    color: null,
    suit: null,
    number: 0,
  });
  deck.push({
    id: "Joker-2",
    type: "Joker",
    color: null,
    suit: null,
    number: 0,
  });
  deck.push({ id: "Ace-1", type: "Ace", color: null, suit: null, number: 0 });

  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const EnchanteDev = () => {
  // Game state
  const [gamePhase, setGamePhase] = useState("character-select");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [aiCharacter, setAiCharacter] = useState("Azure Sage");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Game data
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [aiStats, setAiStats] = useState({});
  const [currentTurn, setCurrentTurn] = useState("player");
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [winner, setWinner] = useState(null);

  // King card decree system
  const [showColorDecree, setShowColorDecree] = useState(false);
  const [pendingKingCard, setPendingKingCard] = useState(null);
  const [selectedDecreeColor, setSelectedDecreeColor] = useState("");
  const [selectedDecreeSuit, setSelectedDecreeSuit] = useState("");

  // Ace card wager system
  const [showAceWager, setShowAceWager] = useState(false);
  const [pendingAceCard, setPendingAceCard] = useState(null);
  const [selectedWagerColor, setSelectedWagerColor] = useState("");

  // Crit system
  const [playerCritThisTurn, setPlayerCritThisTurn] = useState(false);
  const [aiCritThisTurn, setAiCritThisTurn] = useState(false);

  // Coin system
  const [playerCoins, setPlayerCoins] = useState(500);
  const [aiCoins, setAiCoins] = useState(500);
  const [coinPool, setCoinPool] = useState(5000);

  // Betting system
  const [showDrawBet, setShowDrawBet] = useState(false);
  const [showInvestment, setShowInvestment] = useState(false);
  const [showSpeculation, setShowSpeculation] = useState(false);
  const [currentBet, setCurrentBet] = useState({
    amount: 0,
    type: "",
    guess: "",
  });

  // Active bets and speculation
  const [activeBets, setActiveBets] = useState({
    playerDrawBet: null,
    playerSpeculation: null,
  });

  // Investment and temporary modifiers
  const [playerSpeculationUsed, setPlayerSpeculationUsed] = useState(false);
  const [playerInvestment, setPlayerInvestment] = useState(null);
  const [playerTemporaryEgoMod, setPlayerTemporaryEgoMod] = useState(0);
  const [playerInvestmentEgo, setPlayerInvestmentEgo] = useState(0);
  const [playerDrawBetBoost, setPlayerDrawBetBoost] = useState(null);
  const [playerGuaranteedCrit, setPlayerGuaranteedCrit] = useState(false);

  // Ace wager effects
  const [playerTripleDamageCard, setPlayerTripleDamageCard] = useState(null);
  const [aiTripleDamageNext, setAiTripleDamageNext] = useState(false);

  // Affinity helper functions
  const applyAffinityCoinModifier = useCallback((baseCoins, affinity) => {
    if (affinity === "Yellow") {
      return Math.round(baseCoins * 1.25); // +25% more coins
    } else if (affinity === "Green") {
      return Math.round(baseCoins * 0.75); // 25% fewer coins
    }
    return baseCoins;
  }, []);

  const getAffinityBettingBonus = useCallback((affinity, betSuccessful) => {
    if (!betSuccessful) return { damageBonus: 0, defenseBonus: 0 };

    if (affinity === "Red") {
      return { damageBonus: 0.1, defenseBonus: 0 }; // +10% damage for successful betting
    } else if (affinity === "Blue") {
      return { damageBonus: 0, defenseBonus: 0.1 }; // +10% defense bonus for successful betting
    }
    return { damageBonus: 0, defenseBonus: 0 };
  }, []);

  // Initialize game
  const startGame = () => {
    if (!selectedCharacter) return;

    const characterNames = Object.keys(CHARACTERS);
    const randomAiCharacter =
      characterNames[Math.floor(Math.random() * characterNames.length)];
    setAiCharacter(randomAiCharacter);

    const newDeck = createDeck();
    const playerChar = CHARACTERS[selectedCharacter];
    const aiChar = CHARACTERS[randomAiCharacter];

    const playerStartHand = newDeck.slice(0, 7);
    const aiStartHand = newDeck.slice(7, 14);
    const firstDiscard = newDeck[14];
    const remainingDeck = newDeck.slice(15);

    const firstTurn = Math.random() < 0.5 ? "player" : "ai";

    setDeck(remainingDeck);
    setDiscardPile([firstDiscard]);
    setPlayerHand(playerStartHand);
    setAiHand(aiStartHand);
    setPlayerStats({ ...playerChar, currentLuck: playerChar.luck });
    setAiStats({ ...aiChar, currentLuck: aiChar.luck });
    setCurrentTurn(firstTurn);
    setSelectedCards([]);
    setGameLog([
      `Game started! ${selectedCharacter} vs ${randomAiCharacter}`,
      `First turn: ${firstTurn === "player" ? "Player" : "AI"}`,
    ]);
    setWinner(null);
    setGamePhase("game");

    // Reset all state
    setPlayerCoins(100);
    setAiCoins(100);
    setCoinPool(5000);
    setActiveBets({ playerDrawBet: null, playerSpeculation: null });
    setPlayerSpeculationUsed(false);
    setPlayerInvestment(null);
    setPlayerTemporaryEgoMod(0);
    setPlayerInvestmentEgo(0);
    setPlayerDrawBetBoost(null);
    setPlayerGuaranteedCrit(false);
    setShowDrawBet(false);
    setShowInvestment(false);
    setShowSpeculation(false);
    setShowColorDecree(false);
    setPendingKingCard(null);
    setSelectedDecreeColor("");
    setSelectedDecreeSuit("");
    setShowAceWager(false);
    setPendingAceCard(null);
    setSelectedWagerColor("");
    setPlayerTripleDamageCard(null);
    setAiTripleDamageNext(false);
    setCurrentBet({ amount: 0, type: "", guess: "" });

    if (firstTurn === "player") {
      const playerCritRoll = Math.random() * 100 < playerChar.charm;
      setPlayerCritThisTurn(playerCritRoll);
      setAiCritThisTurn(false);
    } else {
      const aiCritRoll = Math.random() * 100 < aiChar.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
    }
  };

  // Memoized functions
  const canStack = useCallback((cards) => {
    if (cards.length <= 1) return true;
    if (cards.some((card) => card.type !== "standard")) return false;
    const suit = cards[0].suit;
    return cards.every((card) => card.suit === suit) && cards.length <= 3;
  }, []);

  const canDiscard = useCallback(
    (cards) => {
      if (discardPile.length === 0) return true;

      if (cards.some((card) => card.type !== "standard")) return true;

      const topCard = discardPile[discardPile.length - 1];

      if (topCard.type !== "standard" && !topCard.decreeColor) {
        return true;
      }

      if (cards.length === 1) {
        return (
          cards[0].color === topCard.color || cards[0].suit === topCard.suit
        );
      }
      return cards.some(
        (card) => card.color === topCard.color || card.suit === topCard.suit
      );
    },
    [discardPile]
  );

  const calculateDamage = useCallback(
    (
      cards,
      attackerAffinity,
      defenderEgo,
      defenderEgoModifier,
      isCrit = false,
      bonusMultiplier = 0,
      hasTripleDamage = false,
      isAiTripleBoost = false,
      hasBettingSuccess = false,
      defenderBlueBonus = 0
    ) => {
      if (cards.some((card) => card.type !== "standard")) {
        return { damage: 0, isCrit: false, normalDamage: 0, critDamage: 0 };
      }

      // Base damage
      let baseDamage = 0;
      for (const card of cards) {
        baseDamage += card.number;
      }

      // Affinity bonus (color matching)
      let damageAfterAffinity = baseDamage;
      let affinityMatchingCards = 0;
      for (const card of cards) {
        if (card.color === attackerAffinity) {
          affinityMatchingCards++;
        }
      }

      if (affinityMatchingCards > 0) {
        damageAfterAffinity = baseDamage * 1.2 + affinityMatchingCards;
      }

      // Crit bonus
      let damageAfterCrit = damageAfterAffinity;
      if (isCrit) {
        damageAfterCrit = damageAfterAffinity * 1.5;
      }

      // Multipliers (like Ace, betting, etc.)
      let damageAfterMultipliers = damageAfterCrit;
      if (bonusMultiplier > 0) {
        damageAfterMultipliers = damageAfterCrit * (1 + bonusMultiplier);
      }

      // Apply triple damage from Ace wager
      if (hasTripleDamage || isAiTripleBoost) {
        damageAfterMultipliers = damageAfterMultipliers * 3;
      }

      // Extra effects - Affinity quirks (Red betting damage bonus)
      let damageAfterEffects = damageAfterMultipliers;
      if (hasBettingSuccess) {
        const affinityBonus = getAffinityBettingBonus(attackerAffinity, true);
        if (affinityBonus.damageBonus > 0) {
          damageAfterEffects =
            damageAfterMultipliers * (1 + affinityBonus.damageBonus);
        }
      }

      // Defense (Ego) - including Blue affinity defense bonus
      const effectiveEgo = Math.max(
        0,
        (defenderEgo || 0) + (defenderEgoModifier || 0) + defenderBlueBonus
      );
      let finalDamage = Math.max(0, damageAfterEffects - effectiveEgo);

      // Calculate normal damage for comparison
      let normalDamageBeforeEgo = damageAfterAffinity;
      if (bonusMultiplier > 0) {
        normalDamageBeforeEgo = damageAfterAffinity * (1 + bonusMultiplier);
      }
      if (hasBettingSuccess) {
        const affinityBonus = getAffinityBettingBonus(attackerAffinity, true);
        if (affinityBonus.damageBonus > 0) {
          normalDamageBeforeEgo =
            normalDamageBeforeEgo * (1 + affinityBonus.damageBonus);
        }
      }
      let normalDamageAfterEgo = Math.max(
        0,
        normalDamageBeforeEgo - effectiveEgo
      );

      return {
        damage: Math.round(finalDamage),
        isCrit: isCrit,
        normalDamage: Math.round(normalDamageAfterEgo),
        critDamage: Math.round(finalDamage),
      };
    },
    [getAffinityBettingBonus]
  );

  // Check win condition and manage investment timers
  useEffect(() => {
    if (gamePhase === "game") {
      if (playerStats.currentLuck <= 0) {
        setWinner("ai");
        setGamePhase("results");
      } else if (aiStats.currentLuck <= 0) {
        setWinner("player");
        setGamePhase("results");
      } else if (
        deck.length === 0 &&
        playerHand.length === 0 &&
        aiHand.length === 0
      ) {
        setWinner(
          playerStats.currentLuck > aiStats.currentLuck
            ? "player"
            : aiStats.currentLuck > playerStats.currentLuck
            ? "ai"
            : "tie"
        );
        setGamePhase("results");
      }
    }
  }, [
    playerStats.currentLuck,
    aiStats.currentLuck,
    deck.length,
    playerHand.length,
    aiHand.length,
    gamePhase,
  ]);

  // Manage investment turn counters and temporary modifiers
  useEffect(() => {
    if (gamePhase === "game" && currentTurn === "player") {
      setPlayerTemporaryEgoMod(0);

      if (playerInvestment && playerInvestment.turnsRemaining > 0) {
        setPlayerInvestment((prev) => {
          const newTurns = prev.turnsRemaining - 1;
          if (newTurns <= 0) {
            setPlayerInvestmentEgo(0);
            return null;
          }
          return { ...prev, turnsRemaining: newTurns };
        });
      }

      if (playerDrawBetBoost && playerDrawBetBoost.turnsRemaining > 0) {
        setPlayerDrawBetBoost((prev) => {
          const newTurns = prev.turnsRemaining - 1;
          if (newTurns <= 0) {
            return null;
          }
          return { ...prev, turnsRemaining: newTurns };
        });
      }
    }
  }, [currentTurn, gamePhase]);

  // Betting functions
  const startDrawBet = () => {
    setCurrentBet({ amount: 0, type: "", guess: "" });
    setShowDrawBet(true);
  };

  const startInvestment = () => {
    setCurrentBet({ amount: 0, type: "", guess: "" });
    setShowInvestment(true);
  };

  const startSpeculation = () => {
    setCurrentBet({ amount: 0, type: "", guess: "" });
    setShowSpeculation(true);
  };

  const submitBet = () => {
    if (currentBet.amount > 0 && currentBet.type && currentBet.guess) {
      if (showDrawBet) {
        setActiveBets((prev) => ({ ...prev, playerDrawBet: currentBet }));
        setPlayerCoins((prev) => prev - currentBet.amount);
      } else if (showSpeculation) {
        setActiveBets((prev) => ({ ...prev, playerSpeculation: currentBet }));
        setPlayerCoins((prev) => prev - currentBet.amount);
      }
      setShowDrawBet(false);
      setShowSpeculation(false);
      setCurrentBet({ amount: 0, type: "", guess: "" });
    }
  };

  const submitInvestment = () => {
    if (currentBet.amount > 0) {
      const turnsOfEgoReduction = Math.ceil(currentBet.amount / 25);
      setPlayerCoins((prev) => prev - currentBet.amount);
      setPlayerInvestment({
        amount: currentBet.amount,
        turnsRemaining: turnsOfEgoReduction,
        bonusUsed: false,
      });
      setPlayerInvestmentEgo(-playerStats.ego);
      setShowInvestment(false);
      setCurrentBet({ amount: 0, type: "", guess: "" });
    }
  };

  const cancelBet = () => {
    setShowDrawBet(false);
    setShowInvestment(false);
    setShowSpeculation(false);
    setCurrentBet({ amount: 0, type: "", guess: "" });
  };

  // King card decree functions
  const executeKingDecree = (newColor, newSuit) => {
    if (pendingKingCard && playerCoins >= 50) {
      setPlayerCoins((prev) => prev - 50);

      const newHand = playerHand.filter(
        (card) => card.id !== pendingKingCard.id
      );
      setPlayerHand(newHand);

      const decreeCard = {
        ...pendingKingCard,
        color: newColor,
        suit: newSuit,
        decreeColor: newColor,
        decreeSuit: newSuit,
      };
      setDiscardPile((prev) => [...prev, decreeCard]);

      setGameLog((prev) => [
        ...prev,
        `Player used King card (50 coins) - Decreed ${newColor} ${newSuit}`,
      ]);

      setSelectedCards([]);
      setShowColorDecree(false);
      setPendingKingCard(null);
      setSelectedDecreeColor("");
      setSelectedDecreeSuit("");

      if (playerGuaranteedCrit) {
        setPlayerGuaranteedCrit(false);
      }

      const aiCritRoll = Math.random() * 100 < aiStats.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
      setCurrentTurn("ai");
    }
  };

  const cancelKingDecree = () => {
    setShowColorDecree(false);
    setPendingKingCard(null);
    setSelectedDecreeColor("");
    setSelectedDecreeSuit("");
  };

  // Ace card wager functions
  const executeAceWager = (colorGuess) => {
    if (pendingAceCard && playerCoins >= 100 && deck.length > 0) {
      setPlayerCoins((prev) => prev - 100);

      const newHand = playerHand.filter(
        (card) => card.id !== pendingAceCard.id
      );
      setPlayerHand(newHand);
      setDiscardPile((prev) => [...prev, pendingAceCard]);

      const drawnCard = deck[0];
      setDeck(deck.slice(1));

      if (drawnCard.type === "standard") {
        const correctGuess = drawnCard.color === colorGuess;

        if (correctGuess) {
          const markedCard = { ...drawnCard, tripleMarked: true };
          setPlayerHand((prev) => [...prev, markedCard]);
          setPlayerTripleDamageCard(markedCard.id);
          setGameLog((prev) => [
            ...prev,
            `Player used Ace card (100 coins) - CORRECT guess! Drew ${drawnCard.color} ${drawnCard.number} of ${drawnCard.suit} (3x damage marked)`,
          ]);
        } else {
          setPlayerHand((prev) => [...prev, drawnCard]);
          setAiTripleDamageNext(true);
          setGameLog((prev) => [
            ...prev,
            `Player used Ace card (100 coins) - WRONG guess! Drew ${drawnCard.color} ${drawnCard.number} of ${drawnCard.suit}, AI next attack gets 3x damage`,
          ]);
        }
      } else {
        // Apply affinity bonus to the 100 coins gained
        const coinsGained = applyAffinityCoinModifier(
          100,
          playerStats.affinity
        );
        setPlayerCoins((prev) => prev + coinsGained);
        setDiscardPile((prev) => [...prev, drawnCard]);
        setGameLog((prev) => [
          ...prev,
          `Player used Ace card (100 coins) - Drew ${
            drawnCard.type
          }, discarded immediately (+${coinsGained} coins${
            playerStats.affinity === "Yellow"
              ? " +25% Yellow bonus!"
              : playerStats.affinity === "Green"
              ? " -25% Green penalty"
              : ""
          })`,
        ]);
      }

      setSelectedCards([]);
      setShowAceWager(false);
      setPendingAceCard(null);
      setSelectedWagerColor("");

      if (playerGuaranteedCrit) {
        setPlayerGuaranteedCrit(false);
      }

      const aiCritRoll = Math.random() * 100 < aiStats.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
      setCurrentTurn("ai");
    }
  };

  const cancelAceWager = () => {
    setShowAceWager(false);
    setPendingAceCard(null);
    setSelectedWagerColor("");
  };

  // Player draw action
  const playerDraw = () => {
    if (deck.length > 0 && currentTurn === "player" && playerHand.length < 14) {
      const drawnCard = deck[0];
      let logMessage = `Player drew ${
        drawnCard.type === "standard"
          ? `${drawnCard.color} ${drawnCard.number} of ${drawnCard.suit}`
          : drawnCard.type
      }`;

      if (activeBets.playerDrawBet && drawnCard.type === "standard") {
        const bet = activeBets.playerDrawBet;
        const betAmount = bet.amount;
        const betPercentage = betAmount / 100;

        let correctGuess = false;
        if (bet.type === "color" && bet.guess === drawnCard.color) {
          correctGuess = true;
        } else if (bet.type === "suit" && bet.guess === drawnCard.suit) {
          correctGuess = true;
        }

        if (correctGuess) {
          if (bet.type === "color") {
            const turnsOfEgoBoost = Math.ceil(betAmount / 25);
            let egoBoostAmount = Math.round(
              playerStats.ego * (betAmount / 100)
            );

            // Apply Blue affinity defense bonus for successful betting
            const affinityBonus = getAffinityBettingBonus(
              playerStats.affinity,
              true
            );
            if (affinityBonus.defenseBonus > 0) {
              egoBoostAmount = Math.round(
                egoBoostAmount * (1 + affinityBonus.defenseBonus)
              );
            }

            setPlayerDrawBetBoost({
              amount: egoBoostAmount,
              turnsRemaining: turnsOfEgoBoost,
            });

            // Apply affinity coin modifier
            const coinsGained = applyAffinityCoinModifier(
              50,
              playerStats.affinity
            );
            setCoinPool((prev) => Math.max(0, prev - coinsGained));
            setPlayerCoins((prev) => Math.min(1000, prev + coinsGained));
            setPlayerHand((prev) => [...prev, drawnCard]);

            logMessage += ` (CORRECT color bet: +${coinsGained} coins${
              playerStats.affinity === "Yellow"
                ? " +25% Yellow!"
                : playerStats.affinity === "Green"
                ? " -25% Green"
                : ""
            }, +${egoBoostAmount} ego (+${betAmount}%${
              affinityBonus.defenseBonus > 0 ? " +10% Blue!" : ""
            }) for ${turnsOfEgoBoost} turns!)`;
          } else {
            // Calculate damage with Red affinity bonus for successful betting
            const damageResult = calculateDamage(
              [drawnCard],
              playerStats.affinity,
              aiStats.ego,
              0,
              playerCritThisTurn || playerGuaranteedCrit,
              betPercentage,
              false,
              false,
              true // hasBettingSuccess for Red affinity bonus
            );
            setDiscardPile((prev) => [...prev, drawnCard]);
            setAiStats((prev) => ({
              ...prev,
              currentLuck: Math.max(0, prev.currentLuck - damageResult.damage),
            }));

            // Apply affinity coin modifier
            const coinsGained = applyAffinityCoinModifier(
              100,
              playerStats.affinity
            );
            setCoinPool((prev) => Math.max(0, prev - coinsGained));
            setPlayerCoins((prev) => Math.min(1000, prev + coinsGained));

            logMessage += ` (CORRECT suit bet: immediately discarded for ${
              damageResult.damage
            } damage${
              playerStats.affinity === "Red" ? " +10% Red bonus!" : ""
            }, +${coinsGained} coins${
              playerStats.affinity === "Yellow"
                ? " +25% Yellow!"
                : playerStats.affinity === "Green"
                ? " -25% Green"
                : ""
            }!)`;
          }
        } else {
          const egoReduction = Math.round(playerStats.ego * (betAmount / 100));
          setPlayerTemporaryEgoMod(-egoReduction);
          setPlayerHand((prev) => [...prev, drawnCard]);
          logMessage += ` (WRONG bet: -${egoReduction} ego (-${betAmount}%) for 1 turn)`;
        }

        setActiveBets((prev) => ({ ...prev, playerDrawBet: null }));
      } else if (activeBets.playerDrawBet && drawnCard.type !== "standard") {
        setPlayerHand((prev) => [...prev, drawnCard]);
        logMessage += ` (Special card: no bet result)`;
        setActiveBets((prev) => ({ ...prev, playerDrawBet: null }));
      } else {
        setPlayerHand((prev) => [...prev, drawnCard]);
      }

      setDeck(deck.slice(1));
      setGameLog((prev) => [...prev, logMessage]);

      if (playerGuaranteedCrit) {
        setPlayerGuaranteedCrit(false);
      }

      const aiCritRoll = Math.random() * 100 < aiStats.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
      setCurrentTurn("ai");
    }
  };

  // Player discard action
  const playerDiscard = () => {
    const isValidPlay =
      selectedCards.length === 1
        ? canDiscard(selectedCards)
        : canStack(selectedCards) && canDiscard(selectedCards);

    if (selectedCards.length > 0 && isValidPlay && currentTurn === "player") {
      // Handle King cards specially
      if (selectedCards.length === 1 && selectedCards[0].type === "King") {
        if (playerCoins >= 50) {
          setPendingKingCard(selectedCards[0]);
          setShowColorDecree(true);
          return;
        } else {
          setGameLog((prev) => [
            ...prev,
            "Not enough coins to play King card (requires 50 coins)",
          ]);
          return;
        }
      }

      // Handle Queen cards specially
      if (selectedCards.length === 1 && selectedCards[0].type === "Queen") {
        if (playerCoins >= 50) {
          setPlayerCoins((prev) => prev - 50);

          const newHand = playerHand.filter(
            (card) => card.id !== selectedCards[0].id
          );
          setPlayerHand(newHand);
          setDiscardPile((prev) => [...prev, selectedCards[0]]);

          setGameLog((prev) => [
            ...prev,
            `Player used Queen card (50 coins) - AI turn skipped!`,
          ]);

          setSelectedCards([]);

          if (playerGuaranteedCrit) {
            setPlayerGuaranteedCrit(false);
          }

          const playerCritRoll = Math.random() * 100 < playerStats.charm;
          setPlayerCritThisTurn(playerCritRoll);
          setAiCritThisTurn(false);
          setCurrentTurn("player");
          return;
        } else {
          setGameLog((prev) => [
            ...prev,
            "Not enough coins to play Queen card (requires 50 coins)",
          ]);
          return;
        }
      }

      // Handle Joker cards specially
      if (selectedCards.length === 1 && selectedCards[0].type === "Joker") {
        if (playerCoins >= 50) {
          setPlayerCoins((prev) => prev - 50);

          const newHand = playerHand.filter(
            (card) => card.id !== selectedCards[0].id
          );
          setPlayerHand(newHand);
          setDiscardPile((prev) => [...prev, selectedCards[0]]);

          const swapCount = Math.min(3, newHand.length, aiHand.length);

          if (swapCount > 0) {
            const playerCards = [...newHand];
            const aiCards = [...aiHand];
            const playerSwapCards = [];
            const aiSwapCards = [];

            for (let i = 0; i < swapCount; i++) {
              const playerIndex = Math.floor(
                Math.random() * playerCards.length
              );
              playerSwapCards.push(playerCards.splice(playerIndex, 1)[0]);

              const aiIndex = Math.floor(Math.random() * aiCards.length);
              aiSwapCards.push(aiCards.splice(aiIndex, 1)[0]);
            }

            setPlayerHand((prev) => {
              const remaining = prev.filter(
                (card) => !playerSwapCards.some((swap) => swap.id === card.id)
              );
              return [...remaining, ...aiSwapCards];
            });

            setAiHand((prev) => {
              const remaining = prev.filter(
                (card) => !aiSwapCards.some((swap) => swap.id === card.id)
              );
              return [...remaining, ...playerSwapCards];
            });

            setGameLog((prev) => [
              ...prev,
              `Player used Joker card (50 coins) - Swapped ${swapCount} cards with AI!`,
            ]);
          } else {
            setGameLog((prev) => [
              ...prev,
              `Player used Joker card (50 coins) - No cards to swap!`,
            ]);
          }

          setSelectedCards([]);

          if (playerGuaranteedCrit) {
            setPlayerGuaranteedCrit(false);
          }

          const aiCritRoll = Math.random() * 100 < aiStats.charm;
          setAiCritThisTurn(aiCritRoll);
          setPlayerCritThisTurn(false);
          setCurrentTurn("ai");
          return;
        } else {
          setGameLog((prev) => [
            ...prev,
            "Not enough coins to play Joker card (requires 50 coins)",
          ]);
          return;
        }
      }

      // Handle Ace cards specially
      if (selectedCards.length === 1 && selectedCards[0].type === "Ace") {
        if (playerCoins >= 100 && deck.length > 0) {
          setPendingAceCard(selectedCards[0]);
          setShowAceWager(true);
          return;
        } else {
          setGameLog((prev) => [
            ...prev,
            deck.length === 0
              ? "Cannot play Ace card - no cards in deck"
              : "Not enough coins to play Ace card (requires 100 coins)",
          ]);
          return;
        }
      }

      // Handle standard cards
      const investmentBonus =
        playerInvestment && !playerInvestment.bonusUsed
          ? playerInvestment.amount / 100
          : 0;

      // Check if any selected cards have triple damage marking
      const hasTripleDamageCard = selectedCards.some(
        (card) => card.id === playerTripleDamageCard
      );

      // Check if investment qualifies as successful betting for Red affinity
      const hasBettingSuccess = investmentBonus > 0;

      const damageResult = calculateDamage(
        selectedCards,
        playerStats.affinity,
        aiStats.ego,
        0,
        playerCritThisTurn || playerGuaranteedCrit,
        investmentBonus,
        hasTripleDamageCard,
        false,
        hasBettingSuccess
      );

      if (investmentBonus > 0 && damageResult.damage > 0) {
        setPlayerInvestment((prev) => ({ ...prev, bonusUsed: true }));
      }

      // Clear triple damage marking if used
      if (hasTripleDamageCard) {
        setPlayerTripleDamageCard(null);
      }

      const newHand = playerHand.filter(
        (card) => !selectedCards.some((selected) => selected.id === card.id)
      );
      setPlayerHand(newHand);
      setDiscardPile((prev) => [...prev, ...selectedCards]);
      setAiStats((prev) => ({
        ...prev,
        currentLuck: Math.max(0, prev.currentLuck - damageResult.damage),
      }));

      const topCard = discardPile[discardPile.length - 1];
      const perfectMatches = selectedCards.filter(
        (card) =>
          card.type === "standard" &&
          topCard.type === "standard" &&
          card.color === topCard.color &&
          card.suit === topCard.suit
      ).length;

      if (perfectMatches > 0) {
        const baseCoinReward =
          perfectMatches === 1 ? 100 : perfectMatches === 2 ? 150 : 225;
        const coinReward = applyAffinityCoinModifier(
          baseCoinReward,
          playerStats.affinity
        );
        setCoinPool((prev) => Math.max(0, prev - coinReward));
        setPlayerCoins((prev) => Math.min(1000, prev + coinReward));
      }

      let logMessage;
      if (damageResult.damage > 0) {
        logMessage = `Player discarded ${selectedCards.length} card(s) for ${
          damageResult.damage
        } damage${
          damageResult.isCrit
            ? ` (${damageResult.normalDamage}→${damageResult.critDamage} CRIT!)`
            : ""
        }`;
        if (investmentBonus > 0) {
          logMessage += ` (+${Math.round(
            investmentBonus * 100
          )}% investment bonus${
            hasBettingSuccess && playerStats.affinity === "Red"
              ? " +10% Red!"
              : ""
          } - now used up)`;
        }
        if (hasTripleDamageCard) logMessage += ` (ACE 3x DAMAGE!)`;
      } else if (selectedCards.some((card) => card.type !== "standard")) {
        logMessage = `Player discarded ${selectedCards[0].type} (no damage)`;
      } else {
        logMessage = `Player discarded ${selectedCards.length} card(s) for ${damageResult.damage} damage`;
      }

      if (perfectMatches > 0) {
        const baseCoinReward =
          perfectMatches === 1 ? 100 : perfectMatches === 2 ? 150 : 225;
        const coinReward = applyAffinityCoinModifier(
          baseCoinReward,
          playerStats.affinity
        );
        logMessage += ` (${perfectMatches} perfect match: +${coinReward} coins${
          playerStats.affinity === "Yellow"
            ? " +25% Yellow!"
            : playerStats.affinity === "Green"
            ? " -25% Green"
            : ""
        }!)`;
      }

      setGameLog((prev) => [...prev, logMessage]);
      setSelectedCards([]);

      if (playerGuaranteedCrit) {
        setPlayerGuaranteedCrit(false);
      }

      const aiCritRoll = Math.random() * 100 < aiStats.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
      setCurrentTurn("ai");
    }
  };

  // Player speculation action
  const playerSpeculate = () => {
    if (
      !playerSpeculationUsed &&
      activeBets.playerSpeculation &&
      currentTurn === "player"
    ) {
      setPlayerSpeculationUsed(true);
      setGameLog((prev) => [
        ...prev,
        `Player used speculation - betting ${activeBets.playerSpeculation.amount} coins on AI's next ${activeBets.playerSpeculation.type} being ${activeBets.playerSpeculation.guess}`,
      ]);

      const aiCritRoll = Math.random() * 100 < aiStats.charm;
      setAiCritThisTurn(aiCritRoll);
      setPlayerCritThisTurn(false);
      setCurrentTurn("ai");
    }
  };

  // AI logic
  useEffect(() => {
    if (currentTurn === "ai" && gamePhase === "game") {
      const aiTurnTimer = setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        let bestPlay = null;
        let bestDamageResult = { damage: -1, isCrit: false };

        const singlePlayableCards = aiHand.filter((card) => {
          if (card.type === "standard") {
            return card.color === topCard.color || card.suit === topCard.suit;
          }
          return false;
        });

        const playerTotalEgoMod =
          playerInvestmentEgo +
          playerTemporaryEgoMod +
          (playerDrawBetBoost ? playerDrawBetBoost.amount : 0);

        for (const card of singlePlayableCards) {
          const damageResult = calculateDamage(
            [card],
            aiStats.affinity,
            playerStats.ego,
            playerTotalEgoMod,
            aiCritThisTurn,
            0,
            false,
            aiTripleDamageNext
          );
          if (damageResult.damage > bestDamageResult.damage) {
            bestDamageResult = damageResult;
            bestPlay = [card];
          }
        }

        const suitGroups = {};
        aiHand.forEach((card) => {
          if (card.type === "standard") {
            if (!suitGroups[card.suit]) suitGroups[card.suit] = [];
            suitGroups[card.suit].push(card);
          }
        });

        for (const suit in suitGroups) {
          const potentialStack = suitGroups[suit];
          if (potentialStack.length > 1) {
            const isStackPlayable = potentialStack.some(
              (card) =>
                card.color === topCard.color || card.suit === topCard.suit
            );
            if (isStackPlayable) {
              for (
                let size = 2;
                size <= Math.min(3, potentialStack.length);
                size++
              ) {
                const stack = potentialStack.slice(0, size);
                const damageResult = calculateDamage(
                  stack,
                  aiStats.affinity,
                  playerStats.ego,
                  playerTotalEgoMod,
                  aiCritThisTurn,
                  0,
                  false,
                  aiTripleDamageNext
                );
                if (damageResult.damage > bestDamageResult.damage) {
                  bestDamageResult = damageResult;
                  bestPlay = stack;
                }
              }
            }
          }
        }

        if (bestPlay) {
          const newAiHand = aiHand.filter(
            (card) => !bestPlay.some((played) => played.id === card.id)
          );
          setAiHand(newAiHand);
          setDiscardPile((prev) => [...prev, ...bestPlay]);

          // Clear AI triple damage boost after use
          if (aiTripleDamageNext) {
            setAiTripleDamageNext(false);
          }

          let speculationMessage = "";
          if (activeBets.playerSpeculation) {
            const spec = activeBets.playerSpeculation;
            let correctGuess = false;

            const aiPlayCard = bestPlay[0];
            if (spec.type === "color" && spec.guess === aiPlayCard.color) {
              correctGuess = true;
            } else if (spec.type === "suit" && spec.guess === aiPlayCard.suit) {
              correctGuess = true;
            }

            if (correctGuess) {
              const luckRestoration = Math.round(
                playerStats.luck * (spec.amount / 100)
              );

              if (spec.type === "color") {
                setPlayerStats((prev) => ({
                  ...prev,
                  currentLuck: Math.min(
                    prev.luck,
                    prev.currentLuck + luckRestoration
                  ),
                }));
                // Apply affinity coin modifier to speculation reward
                const coinsGained = applyAffinityCoinModifier(
                  100,
                  playerStats.affinity
                );
                setCoinPool((prev) => Math.max(0, prev - coinsGained));
                setPlayerCoins((prev) => Math.min(1000, prev + coinsGained));
                speculationMessage = ` | Player speculation CORRECT! (+${luckRestoration} luck, +${coinsGained} coins${
                  playerStats.affinity === "Yellow"
                    ? " +25% Yellow!"
                    : playerStats.affinity === "Green"
                    ? " -25% Green"
                    : ""
                })`;
              } else {
                setPlayerStats((prev) => ({
                  ...prev,
                  currentLuck: Math.min(
                    prev.luck,
                    prev.currentLuck + luckRestoration
                  ),
                }));
                // Apply affinity coin modifier to speculation reward
                const coinsGained = applyAffinityCoinModifier(
                  200,
                  playerStats.affinity
                );
                setCoinPool((prev) => Math.max(0, prev - coinsGained));
                setPlayerCoins((prev) => Math.min(1000, prev + coinsGained));
                setPlayerGuaranteedCrit(true);
                speculationMessage = ` | Player speculation CORRECT! (+${luckRestoration} luck, +${coinsGained} coins${
                  playerStats.affinity === "Yellow"
                    ? " +25% Yellow!"
                    : playerStats.affinity === "Green"
                    ? " -25% Green"
                    : ""
                }, guaranteed crit!)`;
              }
            } else {
              const increasedDamage = Math.round(
                bestDamageResult.damage * (1 + spec.amount / 100)
              );
              setPlayerStats((prev) => ({
                ...prev,
                currentLuck: Math.max(0, prev.currentLuck - increasedDamage),
              }));
              speculationMessage = ` | Player speculation WRONG! (+${spec.amount}% damage = ${increasedDamage} total)`;
            }

            setActiveBets((prev) => ({ ...prev, playerSpeculation: null }));
            setPlayerSpeculationUsed(true);
          } else {
            setPlayerStats((prev) => ({
              ...prev,
              currentLuck: Math.max(
                0,
                prev.currentLuck - bestDamageResult.damage
              ),
            }));
          }

          let logMessage = `AI discarded ${bestPlay.length} card(s) for ${
            bestDamageResult.damage
          } damage${
            bestDamageResult.isCrit
              ? ` (${bestDamageResult.normalDamage}→${bestDamageResult.critDamage} CRIT!)`
              : ""
          }`;
          if (aiTripleDamageNext && bestDamageResult.damage > 0)
            logMessage += ` (ACE 3x DAMAGE!)`;
          logMessage += speculationMessage;

          setGameLog((prev) => [...prev, logMessage]);
        } else if (deck.length > 0) {
          const drawnCard = deck[0];
          setDeck((prev) => prev.slice(1));
          setAiHand((prev) => [...prev, drawnCard]);
          setGameLog((prev) => [...prev, "AI drew a card (no valid plays)"]);
        }

        const playerCritRoll = Math.random() * 100 < playerStats.charm;
        setPlayerCritThisTurn(playerCritRoll);
        setAiCritThisTurn(false);
        setCurrentTurn("player");
      }, 1500);

      return () => clearTimeout(aiTurnTimer);
    }
  }, [
    currentTurn,
    gamePhase,
    aiHand,
    discardPile,
    deck,
    aiStats,
    playerStats,
    playerTemporaryEgoMod,
    playerInvestmentEgo,
    calculateDamage,
    activeBets,
    aiTripleDamageNext,
    applyAffinityCoinModifier,
  ]);

  // Card selection
  const toggleCardSelection = (card) => {
    if (selectedCards.some((selected) => selected.id === card.id)) {
      setSelectedCards(
        selectedCards.filter((selected) => selected.id !== card.id)
      );
    } else if (selectedCards.length < 3) {
      if (
        card.type !== "standard" ||
        selectedCards.some((c) => c.type !== "standard")
      ) {
        setSelectedCards([card]);
      } else {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  // Render card
  const renderCard = (card, isSelected = false, isClickable = false) => {
    const colorClasses = {
      Red: "bg-red-500",
      Blue: "bg-blue-500",
      Yellow: "bg-yellow-500",
      Green: "bg-green-500",
    };
    const suitSymbols = {
      Hearts: "♥",
      Diamonds: "♦",
      Clubs: "♣",
      Spades: "♠",
    };

    if (card.type === "King") {
      return (
        <div
          key={card.id}
          onClick={isClickable ? () => toggleCardSelection(card) : undefined}
          className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-sm select-none bg-purple-600
            ${
              isSelected
                ? "border-yellow-300 scale-105 shadow-lg"
                : "border-gray-300"
            }
            ${
              isClickable
                ? "hover:scale-105 transition-transform cursor-pointer"
                : "cursor-default"
            }`}
        >
          <div className="text-lg">👑</div>
          <div className="text-xs">King</div>
        </div>
      );
    }

    if (card.type === "Queen") {
      return (
        <div
          key={card.id}
          onClick={isClickable ? () => toggleCardSelection(card) : undefined}
          className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-sm select-none bg-pink-600
            ${
              isSelected
                ? "border-yellow-300 scale-105 shadow-lg"
                : "border-gray-300"
            }
            ${
              isClickable
                ? "hover:scale-105 transition-transform cursor-pointer"
                : "cursor-default"
            }`}
        >
          <div className="text-lg">👸</div>
          <div className="text-xs">Queen</div>
        </div>
      );
    }

    if (card.type === "Joker") {
      return (
        <div
          key={card.id}
          onClick={isClickable ? () => toggleCardSelection(card) : undefined}
          className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-sm select-none bg-orange-600
            ${
              isSelected
                ? "border-yellow-300 scale-105 shadow-lg"
                : "border-gray-300"
            }
            ${
              isClickable
                ? "hover:scale-105 transition-transform cursor-pointer"
                : "cursor-default"
            }`}
        >
          <div className="text-lg">🃏</div>
          <div className="text-xs">Joker</div>
        </div>
      );
    }

    if (card.type === "Ace") {
      return (
        <div
          key={card.id}
          onClick={isClickable ? () => toggleCardSelection(card) : undefined}
          className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-sm select-none bg-yellow-600
            ${
              isSelected
                ? "border-yellow-300 scale-105 shadow-lg"
                : "border-gray-300"
            }
            ${
              isClickable
                ? "hover:scale-105 transition-transform cursor-pointer"
                : "cursor-default"
            }
            ${card.tripleMarked ? "ring-4 ring-red-400" : ""}`}
        >
          <div className="text-lg">🂡</div>
          <div className="text-xs">Ace</div>
        </div>
      );
    }

    return (
      <div
        key={card.id}
        onClick={isClickable ? () => toggleCardSelection(card) : undefined}
        className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-sm select-none
          ${colorClasses[card.color]}
          ${
            isSelected
              ? "border-yellow-300 scale-105 shadow-lg"
              : "border-gray-300"
          }
          ${
            isClickable
              ? "hover:scale-105 transition-transform cursor-pointer"
              : "cursor-default"
          }
          ${card.tripleMarked ? "ring-4 ring-red-400" : ""}`}
      >
        <div className="text-lg">{card.number}</div>
        <div className="text-xs">{suitSymbols[card.suit]}</div>
      </div>
    );
  };

  // Color decree modal
  const renderColorDecreeModal = () => {
    if (!showColorDecree) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">King's Decree</h3>
          <p className="mb-4 text-sm text-gray-600">
            Choose the new color and suit for the discard pile:
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color:</label>
            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedDecreeColor(color)}
                  className={`p-2 rounded-lg border-2 text-white font-semibold hover:scale-105 transition-transform
                    ${
                      selectedDecreeColor === color
                        ? "border-yellow-400 scale-105"
                        : "border-gray-300"
                    }
                    ${
                      color === "Red"
                        ? "bg-red-500 hover:bg-red-600"
                        : color === "Blue"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : color === "Yellow"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Suit:</label>
            <div className="grid grid-cols-2 gap-2">
              {SUITS.map((suit) => (
                <button
                  key={suit}
                  onClick={() => setSelectedDecreeSuit(suit)}
                  className={`p-2 rounded-lg border-2 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-transform
                    ${
                      selectedDecreeSuit === suit
                        ? "border-yellow-400 scale-105 bg-yellow-100"
                        : "border-gray-300"
                    }`}
                >
                  {suit}{" "}
                  {suit === "Hearts"
                    ? "♥"
                    : suit === "Diamonds"
                    ? "♦"
                    : suit === "Clubs"
                    ? "♣"
                    : "♠"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cost: 50 coins</span>
            <div className="flex gap-2">
              <button
                onClick={cancelKingDecree}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  executeKingDecree(selectedDecreeColor, selectedDecreeSuit)
                }
                disabled={!selectedDecreeColor || !selectedDecreeSuit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded"
              >
                Decree
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Ace wager modal
  const renderAceWagerModal = () => {
    if (!showAceWager) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Ace Wager</h3>
          <p className="mb-4 text-sm text-gray-600">
            Guess the color of the card you will draw:
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedWagerColor(color)}
                className={`p-3 rounded-lg border-2 text-white font-semibold hover:scale-105 transition-transform
                  ${
                    selectedWagerColor === color
                      ? "border-yellow-400 scale-105"
                      : "border-gray-300"
                  }
                  ${
                    color === "Red"
                      ? "bg-red-500 hover:bg-red-600"
                      : color === "Blue"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : color === "Yellow"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-600 mb-4">
            <p>• Correct: Drawn card gets 3x damage</p>
            <p>• Wrong: AI next attack gets 3x damage</p>
            <p>
              • Special card: Discard immediately, +100 coins
              {playerStats.affinity === "Yellow"
                ? " (+25% Yellow bonus!)"
                : playerStats.affinity === "Green"
                ? " (-25% Green penalty)"
                : ""}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cost: 100 coins</span>
            <div className="flex gap-2">
              <button
                onClick={cancelAceWager}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => executeAceWager(selectedWagerColor)}
                disabled={!selectedWagerColor}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded"
              >
                Wager
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Betting UI
  const renderBettingModal = () => {
    if (!showDrawBet && !showInvestment && !showSpeculation) return null;

    let title = "";
    let options = [];

    if (showDrawBet) {
      title = "Bet on Draw";
      options = [
        {
          type: "color",
          label: "What color will you draw?",
          reward: `Correct: +ego boost${
            playerStats.affinity === "Blue" ? " (+10% Blue bonus!)" : ""
          } + ${applyAffinityCoinModifier(50, playerStats.affinity)} coins${
            playerStats.affinity === "Yellow"
              ? " (+25% Yellow!)"
              : playerStats.affinity === "Green"
              ? " (-25% Green)"
              : ""
          }`,
        },
        {
          type: "suit",
          label: "What suit will you draw?",
          reward: `Correct: Immediate discard with bonus damage${
            playerStats.affinity === "Red" ? " (+10% Red bonus!)" : ""
          } + ${applyAffinityCoinModifier(100, playerStats.affinity)} coins${
            playerStats.affinity === "Yellow"
              ? " (+25% Yellow!)"
              : playerStats.affinity === "Green"
              ? " (-25% Green)"
              : ""
          }`,
        },
      ];
    } else if (showSpeculation) {
      title = "Speculation (Once per game)";
      options = [
        {
          type: "color",
          label: "What color will AI attack with?",
          reward: `Correct: Heal damage + ${applyAffinityCoinModifier(
            100,
            playerStats.affinity
          )} coins${
            playerStats.affinity === "Yellow"
              ? " (+25% Yellow!)"
              : playerStats.affinity === "Green"
              ? " (-25% Green)"
              : ""
          }`,
        },
        {
          type: "suit",
          label: "What suit will AI attack with?",
          reward: `Correct: Heal damage + ${applyAffinityCoinModifier(
            200,
            playerStats.affinity
          )} coins${
            playerStats.affinity === "Yellow"
              ? " (+25% Yellow!)"
              : playerStats.affinity === "Green"
              ? " (-25% Green)"
              : ""
          } + guaranteed crit`,
        },
      ];
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">{title}</h3>

          {showInvestment ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Investment Amount (Max: {playerCoins})
                </label>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setCurrentBet((prev) => ({ ...prev, amount }))
                      }
                      disabled={amount > playerCoins}
                      className={`px-3 py-2 rounded border text-sm font-semibold ${
                        currentBet.amount === amount
                          ? "bg-blue-500 text-white"
                          : amount > playerCoins
                          ? "bg-gray-200 text-gray-400"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                {currentBet.amount > 0 && (
                  <div className="text-xs text-gray-600 mt-2">
                    <p>
                      Effect: +{currentBet.amount}% damage boost
                      {playerStats.affinity === "Red"
                        ? " (+10% Red if successful!)"
                        : ""}
                    </p>
                    <p>
                      Cost: Ego reduced to 0 for{" "}
                      {Math.ceil(currentBet.amount / 25)} turns
                    </p>
                  </div>
                )}
                {playerGuaranteedCrit && (
                  <span className="ml-2 text-purple-600">
                    ⭐ Guaranteed Crit
                  </span>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelBet}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitInvestment}
                  disabled={!currentBet.amount}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded"
                >
                  Invest ({currentBet.amount} coins)
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Bet Amount (Max: {playerCoins})
                </label>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setCurrentBet((prev) => ({ ...prev, amount }))
                      }
                      disabled={amount > playerCoins}
                      className={`px-3 py-2 rounded border text-sm font-semibold ${
                        currentBet.amount === amount
                          ? "bg-blue-500 text-white"
                          : amount > playerCoins
                          ? "bg-gray-200 text-gray-400"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                {showSpeculation && currentBet.amount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Wrong guess: +{currentBet.amount}% damage from AI attack
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Prediction Type
                </label>
                <div className="space-y-2">
                  {options.map((option) => (
                    <button
                      key={option.type}
                      onClick={() =>
                        setCurrentBet((prev) => ({
                          ...prev,
                          type: option.type,
                        }))
                      }
                      className={`w-full p-2 rounded border text-left ${
                        currentBet.type === option.type
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-600">
                        {option.reward}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {currentBet.type && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Your Guess
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(currentBet.type === "color" ? COLORS : SUITS).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setCurrentBet((prev) => ({
                              ...prev,
                              guess: option,
                            }))
                          }
                          className={`p-2 rounded border text-sm ${
                            currentBet.guess === option
                              ? "bg-green-100 border-green-400"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelBet}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBet}
                  disabled={
                    !currentBet.amount || !currentBet.type || !currentBet.guess
                  }
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
                >
                  Place Bet ({currentBet.amount} coins)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Onboarding modal
  const renderOnboardingModal = () => {
    if (!showOnboarding) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-800">
                Welcome to Enchante!
              </h2>
              <button
                onClick={() => setShowOnboarding(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Game Objective */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Game Objective
                </h3>
                <p className="text-gray-700">
                  Reduce your opponent's Luck to zero by playing cards
                  strategically. You're magical gamblers using your luck as life
                  force in high-stakes card duels!
                </p>
              </div>

              {/* Character Stats */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Character Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-700">Luck</h4>
                    <p className="text-sm text-gray-600">
                      Your health points. Game ends when this reaches zero.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">Ego</h4>
                    <p className="text-sm text-gray-600">
                      Your defense. Reduces incoming damage from attacks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">Charm</h4>
                    <p className="text-sm text-gray-600">
                      Your critical hit chance. Higher charm = more crits!
                    </p>
                  </div>
                </div>
              </div>

              {/* Affinities */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Character Affinities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="font-semibold">Red:</span>
                    <span className="text-sm">
                      Attack bonuses for all attack boosting actions. Glass
                      cannons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="font-semibold">Blue:</span>
                    <span className="text-sm">
                      Defense bonuses for all defense boosting actions. Turtles
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="font-semibold">Yellow:</span>
                    <span className="text-sm">
                      Earn more coins from all sources. Coin farmers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-semibold">Green:</span>
                    <span className="text-sm">
                      Earn fewer coins but typically higher luck. Luck tanks
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Types */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  Card Types
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-yellow-700">
                      Standard Cards (112 total)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Numbered cards 1-7 in four colors (Red, Blue, Yellow,
                      Green) and four suits (Hearts, Diamonds, Clubs, Spades).
                      These deal damage equal to their number.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <h5 className="font-semibold">👑 King (2 cards)</h5>
                      <p className="text-xs text-gray-600">
                        Change the discard pile's color and suit
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold">👸 Queen (2 cards)</h5>
                      <p className="text-xs text-gray-600">
                        Skip opponent's next turn
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold">🃏 Joker (2 cards)</h5>
                      <p className="text-xs text-gray-600">
                        Swap 3 random cards with opponent
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold">🂡 Ace (1 card)</h5>
                      <p className="text-xs text-gray-600">
                        Wager on a card draw for triple damage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Turn Structure */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">
                  How to Play
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-orange-700">
                      On Your Turn, Choose One Main Action:
                    </h4>
                    <div className="ml-4 space-y-2">
                      <div>
                        <span className="font-semibold">🎯 Draw a Card:</span>
                        <span className="text-sm text-gray-600 ml-2">
                          Add a card to your hand. You can bet on what
                          color/suit you'll draw!
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">⚔️ Discard Cards:</span>
                        <span className="text-sm text-gray-600 ml-2">
                          Play cards to attack your opponent. Must match color
                          or suit of top discard card.
                        </span>
                      </div>
                    </div>
                    <br />
                    <h4 className="font-semibold text-orange-700">
                      Plus an Optional Extra Action:
                    </h4>
                    <div>
                      <span className="font-semibold">🤑 Speculate:</span>
                      <span className="text-sm text-gray-600 ml-2">
                        Guess the incoming attack's color or suit for bonuses!
                        These can swing games or end them!
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded">
                    <h4 className="font-semibold text-orange-700 mb-2">
                      Card Matching Rules:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • You can only discard cards that match the top card's
                        color OR suit
                      </li>
                      <li>
                        • You can stack up to 3 cards of the same suit for one
                        powerful attack
                      </li>
                      <li>
                        • Special cards can be played anytime but cost coins
                      </li>
                      <li>• Match both color AND suit for bonus coins!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Betting System */}
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">
                  Betting & Strategy
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Coins</span> are your
                    betting currency. Use them to:
                  </p>
                  <ul className="text-sm text-gray-600 ml-4 space-y-1">
                    <li>
                      • Bet on what card you'll draw (guess right for bonuses!)
                    </li>
                    <li>• Invest in your attacks for extra damage</li>
                    <li>• Play special cards for powerful effects</li>
                    <li>• Speculate on opponent's moves (advanced strategy)</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold text-pink-700">
                      Risk vs Reward:
                    </span>
                    Betting can give you powerful bonuses, but wrong guesses
                    have penalties!
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Start Playing!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (gamePhase === "character-select") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {renderOnboardingModal()}

        {/* Help icon */}
        <button
          onClick={() => setShowOnboarding(true)}
          className="fixed top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-40"
          title="Game Rules"
        >
          ?
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">
          Enchante - Version Alpha
        </h1>
        <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Choose Your Character</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(CHARACTERS).map(([name, stats]) => (
              <div
                key={name}
                onClick={() => setSelectedCharacter(name)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCharacter === name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Affinity: {stats.affinity}
                </p>
                <div className="text-sm">
                  <div>Luck: {stats.luck}</div>
                  <div>Ego: {stats.ego}</div>
                  <div>Charm: {stats.charm}</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {stats.affinity === "Red" &&
                    "High damage for successful betting (+10%)"}
                  {stats.affinity === "Blue" &&
                    "High defense for successful betting (+10%)"}
                  {stats.affinity === "Yellow" &&
                    "+25% more coins from all sources"}
                  {stats.affinity === "Green" &&
                    "-25% fewer coins from all sources"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              AI Opponent: Random Character
            </p>
            <button
              onClick={startGame}
              disabled={!selectedCharacter}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold w-full"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === "results") {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        {renderOnboardingModal()}

        {/* Help icon */}
        <button
          onClick={() => setShowOnboarding(true)}
          className="fixed top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-40"
          title="Game Rules"
        >
          ?
        </button>

        <h1 className="text-3xl font-bold mb-8">Game Over!</h1>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            {winner === "player"
              ? "You Win!"
              : winner === "ai"
              ? "AI Wins!"
              : "It is a Tie!"}
          </h2>
          <div className="mb-6">
            <p>Final Stats:</p>
            <p>Player Luck: {playerStats.currentLuck}</p>
            <p>AI Luck: {aiStats.currentLuck}</p>
            <p>Player Coins: {playerCoins}</p>
            <p>Coin Pool Remaining: {coinPool}</p>
          </div>

          <div className="mb-6 text-left">
            <h3 className="text-lg font-semibold mb-3 text-center">Game Log</h3>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
              <div className="text-sm space-y-1">
                {gameLog.map((log, index) => (
                  <div
                    key={index}
                    className="py-1 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-gray-500 text-xs mr-2">
                      {index + 1}.
                    </span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setGamePhase("character-select")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans">
      {renderOnboardingModal()}

      {/* Help icon */}
      <button
        onClick={() => setShowOnboarding(true)}
        className="fixed top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-40"
        title="Game Rules"
      >
        ?
      </button>

      {renderBettingModal()}
      {renderColorDecreeModal()}
      {renderAceWagerModal()}

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-center">
          Enchante - Version Alpha
        </h1>
        <div className="flex justify-between text-sm mt-2 text-gray-600">
          <div>
            Turn:{" "}
            <span className="font-semibold">
              {currentTurn === "player" ? "Your Turn" : "AI Thinking..."}
            </span>
          </div>
          <div>
            Cards in deck: {deck.length} | Coin Pool:{" "}
            {coinPool.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800">
            Player ({selectedCharacter})
          </h3>
          <div className="flex gap-4 text-sm text-blue-700">
            <span>
              Luck: {playerStats.currentLuck}/{playerStats.luck}
            </span>
            <span>
              Ego:{" "}
              {Math.max(
                0,
                playerStats.ego +
                  playerInvestmentEgo +
                  playerTemporaryEgoMod +
                  (playerDrawBetBoost ? playerDrawBetBoost.amount : 0)
              )}
            </span>
            <span>Charm: {playerStats.charm}</span>
            <span>Coins: {playerCoins}</span>
          </div>
          <div className="text-xs mt-1 text-blue-600">
            Affinity: {playerStats.affinity}
            {playerStats.affinity === "Red" && " (+10% betting damage)"}
            {playerStats.affinity === "Blue" && " (+10% betting defense)"}
            {playerStats.affinity === "Yellow" && " (+25% coins)"}
            {playerStats.affinity === "Green" && " (-25% coins)"}
            {playerTemporaryEgoMod !== 0 && (
              <span
                className={`ml-2 ${
                  playerTemporaryEgoMod > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Temp Ego {playerTemporaryEgoMod > 0 ? "+" : ""}
                {playerTemporaryEgoMod}
              </span>
            )}
            {playerInvestment && (
              <span className="ml-2 text-orange-600">
                Investment: {playerInvestment.turnsRemaining} turns left
                {playerInvestment.bonusUsed
                  ? " (bonus used)"
                  : " (bonus ready)"}
              </span>
            )}
            {playerDrawBetBoost && (
              <span className="ml-2 text-blue-600">
                Draw Boost: +{playerDrawBetBoost.amount} ego for{" "}
                {playerDrawBetBoost.turnsRemaining} turns
              </span>
            )}
            {playerTripleDamageCard && (
              <span className="ml-2 text-red-600">Ace 3x Card Ready!</span>
            )}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800">AI ({aiCharacter})</h3>
          <div className="flex gap-4 text-sm text-red-700">
            <span>
              Luck: {aiStats.currentLuck}/{aiStats.luck}
            </span>
            <span>Ego: {aiStats.ego}</span>
            <span>Charm: {aiStats.charm}</span>
            <span>Cards: {aiHand.length}</span>
          </div>
          <div className="text-xs mt-1 text-red-600">
            Affinity: {aiStats.affinity}
            {aiStats.affinity === "Red" && " (+10% betting damage)"}
            {aiStats.affinity === "Blue" && " (+10% betting defense)"}
            {aiStats.affinity === "Yellow" && " (+25% coins)"}
            {aiStats.affinity === "Green" && " (-25% coins)"}
            {aiTripleDamageNext && " | Next attack: 3x damage from Ace!"}
          </div>
        </div>
      </div>

      {(activeBets.playerDrawBet || activeBets.playerSpeculation) && (
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Active Bets</h4>
          {activeBets.playerDrawBet && (
            <div className="text-sm text-yellow-700">
              Draw Bet: {activeBets.playerDrawBet.amount} coins on{" "}
              {activeBets.playerDrawBet.type} = {activeBets.playerDrawBet.guess}
            </div>
          )}
          {activeBets.playerSpeculation && (
            <div className="text-sm text-yellow-700">
              Speculation: {activeBets.playerSpeculation.amount} coins on AI
              next {activeBets.playerSpeculation.type} ={" "}
              {activeBets.playerSpeculation.guess}
            </div>
          )}
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="font-semibold mb-2">Discard Pile</h3>
        <div className="flex justify-center h-24 items-center">
          {discardPile.length > 0 ? (
            renderCard(discardPile[discardPile.length - 1])
          ) : (
            <div className="w-16 h-24 rounded-lg border-2 border-dashed border-gray-300" />
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2 text-center">Your Hand</h3>
        <div className="flex gap-2 flex-wrap justify-center min-h-[6rem]">
          {playerHand.map((card) =>
            renderCard(
              card,
              selectedCards.some((c) => c.id === card.id),
              currentTurn === "player"
            )
          )}
        </div>
      </div>

      {currentTurn === "player" && (
        <div className="space-y-3 mb-4">
          <div className="flex gap-2 justify-center">
            <button
              onClick={playerDraw}
              disabled={deck.length === 0 || playerHand.length >= 14}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Draw Card ({playerHand.length}/14)
            </button>
            <button
              onClick={startDrawBet}
              disabled={
                deck.length === 0 ||
                playerCoins < 25 ||
                activeBets.playerDrawBet ||
                playerHand.length >= 14
              }
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Bet on Draw
            </button>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={playerDiscard}
              disabled={
                selectedCards.length === 0 ||
                !(selectedCards.length === 1
                  ? canDiscard(selectedCards)
                  : canStack(selectedCards) && canDiscard(selectedCards))
              }
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Discard ({selectedCards.length})
            </button>
            <button
              onClick={startInvestment}
              disabled={
                selectedCards.length === 0 ||
                playerCoins < 25 ||
                playerInvestment
              }
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Invest
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() =>
                activeBets.playerSpeculation
                  ? playerSpeculate()
                  : startSpeculation()
              }
              disabled={
                playerSpeculationUsed ||
                (playerCoins < 25 && !activeBets.playerSpeculation)
              }
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              {activeBets.playerSpeculation
                ? "Cancel Speculation (No Refund)"
                : playerSpeculationUsed
                ? "Speculation Used"
                : "Speculate (Once per game)"}
            </button>
          </div>
        </div>
      )}

      {selectedCards.length > 0 &&
        selectedCards.every((card) => card.type === "standard") && (
          <div className="text-center text-sm mb-4 text-gray-600">
            <p>
              {(() => {
                const investmentBonus =
                  playerInvestment && !playerInvestment.bonusUsed
                    ? playerInvestment.amount / 100
                    : 0;
                const hasTripleDamageCard = selectedCards.some(
                  (card) => card.id === playerTripleDamageCard
                );
                const hasBettingSuccess = investmentBonus > 0;
                const result = calculateDamage(
                  selectedCards,
                  playerStats.affinity,
                  aiStats.ego,
                  0,
                  playerCritThisTurn || playerGuaranteedCrit,
                  investmentBonus,
                  hasTripleDamageCard,
                  false,
                  hasBettingSuccess
                );

                let baseDamage = 0;
                for (const card of selectedCards) {
                  baseDamage += card.number;
                }

                let affinityMatchingCards = 0;
                for (const card of selectedCards) {
                  if (card.color === playerStats.affinity) {
                    affinityMatchingCards++;
                  }
                }

                let damageAfterAffinity = baseDamage;
                if (affinityMatchingCards > 0) {
                  damageAfterAffinity =
                    baseDamage * 1.2 + affinityMatchingCards;
                }

                let damageAfterCrit = damageAfterAffinity;
                if (playerCritThisTurn || playerGuaranteedCrit) {
                  damageAfterCrit = damageAfterAffinity * 1.5;
                }

                let damageAfterMultipliers = damageAfterCrit;
                if (investmentBonus > 0) {
                  damageAfterMultipliers =
                    damageAfterCrit * (1 + investmentBonus);
                }

                if (hasTripleDamageCard) {
                  damageAfterMultipliers = damageAfterMultipliers * 3;
                }

                let damageAfterEffects = damageAfterMultipliers;
                if (hasBettingSuccess && playerStats.affinity === "Red") {
                  damageAfterEffects = damageAfterMultipliers * 1.1;
                }

                let formula = `${baseDamage}`;
                if (affinityMatchingCards > 0) {
                  formula += ` → (${baseDamage}×1.2)+${affinityMatchingCards} = ${damageAfterAffinity.toFixed(
                    1
                  )}`;
                }
                if (playerCritThisTurn || playerGuaranteedCrit) {
                  formula += ` → ${damageAfterAffinity.toFixed(
                    1
                  )}×1.5 = ${damageAfterCrit.toFixed(1)}`;
                }
                if (investmentBonus > 0) {
                  formula += ` → ${damageAfterCrit.toFixed(1)}×${
                    1 + investmentBonus
                  } = ${damageAfterMultipliers.toFixed(1)}`;
                }
                if (hasTripleDamageCard) {
                  formula += ` → ${(damageAfterMultipliers / 3).toFixed(
                    1
                  )}×3 = ${damageAfterMultipliers.toFixed(1)}`;
                }
                if (hasBettingSuccess && playerStats.affinity === "Red") {
                  formula += ` → ${damageAfterMultipliers.toFixed(
                    1
                  )}×1.1 = ${damageAfterEffects.toFixed(1)}`;
                }
                formula += ` → ${damageAfterEffects.toFixed(1)}-${
                  aiStats.ego
                } = ${result.damage}`;

                return `${formula} | Turn: ${
                  playerCritThisTurn || playerGuaranteedCrit
                    ? "⭐ CRIT"
                    : "Normal"
                }${hasTripleDamageCard ? " | ACE 3X" : ""}${
                  hasBettingSuccess && playerStats.affinity === "Red"
                    ? " | RED +10%"
                    : ""
                }`;
              })()}
            </p>
          </div>
        )}

      {selectedCards.length > 0 &&
        selectedCards.some((card) => card.type === "King") && (
          <div className="text-center text-sm mb-4 text-purple-600 font-semibold">
            King card selected - Costs 50 coins, allows you to change discard
            pile color and suit
          </div>
        )}

      {selectedCards.length > 0 &&
        selectedCards.some((card) => card.type === "Queen") && (
          <div className="text-center text-sm mb-4 text-pink-600 font-semibold">
            Queen card selected - Costs 50 coins, skips opponent's next turn
          </div>
        )}

      {selectedCards.length > 0 &&
        selectedCards.some((card) => card.type === "Joker") && (
          <div className="text-center text-sm mb-4 text-orange-600 font-semibold">
            Joker card selected - Costs 50 coins, swaps up to 3 random cards
            with opponent
          </div>
        )}

      {selectedCards.length > 0 &&
        selectedCards.some((card) => card.type === "Ace") && (
          <div className="text-center text-sm mb-4 text-yellow-600 font-semibold">
            Ace card selected - Costs 100 coins, wager on color of drawn card
            for 3x damage
          </div>
        )}

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Game Log</h3>
        <div className="max-h-32 overflow-y-auto text-sm space-y-1">
          {[...gameLog].reverse().map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnchanteDev;
