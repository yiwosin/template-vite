import { BingoCard } from './bingo-card.js';
import { gameWidth, gameHeight } from '../config.js';

export class BingoCardContainer {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        this.activeCardIndex = 0;
    }

    createCards(numberOfCards = 1) {
        this.cards = [];
        
        for (let i = 0; i < numberOfCards; i++) {
            const card = new BingoCard(this.scene);
            card.generate();
            this.cards.push(card);
        }
        
        this.displayActiveCard();
        this.createCardNavigation();
    }

    displayActiveCard() {
        // Clear existing display
        this.clearDisplay();
        
        // Display current active card
        if (this.cards[this.activeCardIndex]) {
            this.cards[this.activeCardIndex].createDisplay();
        }
    }

    createCardNavigation() {
        if (this.cards.length <= 1) return;

        const navY = gameHeight * 0.85;
        
        // Previous button
        this.prevButton = this.scene.add.rectangle(gameWidth * 0.2, navY, 80, 40, 0x3498db)
            .setInteractive({ useHandCursor: true });
        this.scene.add.text(gameWidth * 0.2, navY, '← PREV', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Card indicator
        this.cardIndicator = this.scene.add.text(gameWidth * 0.5, navY, 
            `Card ${this.activeCardIndex + 1} of ${this.cards.length}`, {
            fontSize: '16px',
            fill: '#2c3e50'
        }).setOrigin(0.5);

        // Next button
        this.nextButton = this.scene.add.rectangle(gameWidth * 0.8, navY, 80, 40, 0x3498db)
            .setInteractive({ useHandCursor: true });
        this.scene.add.text(gameWidth * 0.8, navY, 'NEXT →', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button handlers
        this.prevButton.on('pointerdown', () => this.switchCard(-1));
        this.nextButton.on('pointerdown', () => this.switchCard(1));
    }

    switchCard(direction) {
        this.activeCardIndex += direction;
        
        if (this.activeCardIndex < 0) {
            this.activeCardIndex = this.cards.length - 1;
        } else if (this.activeCardIndex >= this.cards.length) {
            this.activeCardIndex = 0;
        }
        
        this.displayActiveCard();
        this.updateCardIndicator();
    }

    updateCardIndicator() {
        if (this.cardIndicator) {
            this.cardIndicator.setText(`Card ${this.activeCardIndex + 1} of ${this.cards.length}`);
        }
    }

    clearDisplay() {
        // This would need to be implemented to clear previous card display
        // For now, you might need to destroy and recreate the scene
    }

    getActiveCard() {
        return this.cards[this.activeCardIndex];
    }

    getAllCards() {
        return this.cards;
    }

    highlightNumberOnAllCards(number) {
        this.cards.forEach(card => {
            if (card.highlightNumber) {
                card.highlightNumber(number);
            }
        });
    }

    resetAllCards() {
        this.cards.forEach(card => {
            card.reset();
        });
        this.displayActiveCard();
    }
}