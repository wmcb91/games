'use strict';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'D', 'H', 'S'];
const rankCount = ranks.length;
const suitCount = suits.length;

const Game = function Game() {
  this.cardsOnBoard = [];
  this.cardElements = [];
  this.foundPairs = [];
  this.flippedCards = [];
  this.flippedCardIds = [];
  this.flippedCardElements = [];
  this.allowClick = true;

  this.shuffleCards = () => {
    for (let i = this.cardElements.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cardElements[i], this.cardElements[j]] = [this.cardElements[j], this.cardElements[i]];
    }
  }
  
  this.addActivePair = () => {
    this.flippedCardElements.forEach(cardElement => {
      cardElement.classList.add('paired');
      cardElement.removeEventListener('click', this.flipCard);
    });
    this.foundPairs.push(game.flippedCards[0]);
    this.resetFlippedCards();

    if (this.foundPairs.length === this.cardsOnBoard.length) {
      this.endGame();
    }
  };

  this.flipMissmatchedCards = () => {
    this.flippedCardElements.forEach(cardElement => {
      cardElement.classList.remove('flipped');
    });
    this.resetFlippedCards();
  };

  this.judgePair = () => {
    if (this.flippedCards[0] === this.flippedCards[1]) {
      this.addActivePair();
    } else {
      this.flipMissmatchedCards();
    }
    this.allowClick = true;
  }
  
  this.flipCard = event => {
    let cardElement = event.path.find(el => el.classList.contains('card'));
    let card = cardElement.id.split('-')[0];

    if (!this.allowClick || cardElement.id === this.flippedCardIds[0]) {
      return;
    }

    cardElement.classList.add('flipped');
    this.flippedCards.push(card);
    this.flippedCardIds.push(cardElement.id);
    this.flippedCardElements.push(cardElement);

    if (this.flippedCards.length == 2) {
      this.allowClick = false;
      setTimeout(this.judgePair, 500);
    }
  };
  
  this.createCards = cards => {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards.forEach(card => {
      for (let i = 0; i < 2; i++) {
        let cardElement = document.createElement('div');
        let cardInner = document.createElement('div');
        let cardFront = document.createElement('img');
        let cardBack = document.createElement('img');

        // Add ID, Class and Event listener to card
        cardElement.id =`${card}-${i}`;
        cardElement.classList.add('card');
        cardElement.addEventListener('click', this.flipCard);

        // Style card
        cardInner.classList.add('card-inner');
        
        cardFront.src = `./assets/cards/blue_back.png`;
        cardFront.classList.add('front');

        cardBack.src = `./assets/cards/${card}.png`;
        cardBack.classList.add('back');

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        this.cardElements.push(cardElement);
      }
    });

    this.shuffleCards();    
    this.cardElements.forEach(cardElement => gameBoard.appendChild(cardElement));
  }
  
  this.buildBoard = count => {
    count = Math.min(count, 20);
    for (let i = 0; i < count; i++) {
      let validCard = false;
      let rank, suit, card;
      while (!validCard) {
        rank = ranks[Math.floor(Math.random() * rankCount)];
        suit = suits[Math.floor(Math.random() * suitCount)];
        card = rank + suit;
        validCard = !this.cardsOnBoard.includes(card);
        if (validCard) {
          this.cardsOnBoard.push(card);
        }
      }
    }
    
    this.createCards(this.cardsOnBoard);
  };

  this.endGame = () => {
    document.getElementById('win-msg').style.display = 'block';
    setTimeout(this.resetBoard, 3000);
  }

  this.resetFlippedCards = () => {
    this.flippedCards = [];
    this.flippedCardIds = [];
    this.flippedCardElements = [];
  }

  this.resetBoard = () => {
    this.cardsOnBoard = [];
    this.cardElements = [];
    this.foundPairs = [];
    this.resetFlippedCards();

    document.getElementById('win-msg').style.display = 'none';
    this.buildBoard(9);
  }
};

const game = new Game();
game.buildBoard(9);
