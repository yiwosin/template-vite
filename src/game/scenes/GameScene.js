import { BingoCard } from '../components/bingo-card.js';
import { NumberManager } from '../components/number-manager.js';
import { WinChecker } from '../components/win-checker.js';
import { UIController } from '../components/ui-controller.js';
import { GameStateManager } from '../components/gamestate-manager.js';
import { gameWidth, gameHeight } from '../config.js';
import { BingoCardWithBackground } from '../components/bingo-card-with-background.js';

// Refactored Game Scene
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Get number of cards from registry
        const numberOfCards = this.registry.get('numberOfCards') || 1;
        
        // Initialize background
        this.add.image(gameWidth / 2, gameHeight / 2, 'background');

        // Initialize components based on number of cards
        if (numberOfCards === 1) {
            this.bingoCard = new BingoCardWithBackground(this, gameWidth / 2, gameHeight * 0.5);
        } else {
            // Create two cards side by side
            this.bingoCard1 = new BingoCardWithBackground(this, gameWidth * 0.3, gameHeight * 0.5, 'CARD 1');
            this.bingoCard2 = new BingoCardWithBackground(this, gameWidth * 0.7, gameHeight * 0.5, 'CARD 2');
            
            // Add card labels
            this.add.text(gameWidth * 0.3, gameHeight * 0.25, 'CARD 1', {
                fontSize: Math.min(gameWidth * 0.05, 20) + 'px',
                fontFamily: 'raventure',
                fill: '#2c3e50'
            }).setOrigin(0.5);
            
            this.add.text(gameWidth * 0.7, gameHeight * 0.25, 'CARD 2', {
                fontSize: Math.min(gameWidth * 0.05, 20) + 'px',
                fontFamily: 'raventure',
                fill: '#2c3e50'
            }).setOrigin(0.5);
        }

        this.numberOfCards = numberOfCards;
        this.numberManager = new NumberManager(this);
        this.winChecker = new WinChecker(this);
        this.uiController = new UIController(this);
        this.gameState = new GameStateManager(this);

        // Setup game components
        this.setupGame();
        
        // Create numbers popup
        this.createNumbersPopup();
        
        // Start countdown before game begins
        this.startCountdown();
    }

    setupGame() {
        if (this.numberOfCards === 1) {
            // Generate and display single card
            this.bingoCard.generate();
            this.bingoCard.createDisplay('bingo-card');
        } else {
            // Generate and display both cards
            this.bingoCard1.generate();
            this.bingoCard1.createDisplay('bingo-card');
            this.bingoCard2.generate();
            this.bingoCard2.createDisplay('bingo-card');
        }

        // Initialize number manager
        this.numberManager.initialize();

        // Create UI
        this.uiController.createInterface();
    }

    startCountdown() {
        let countdownValue = 5;
        
        // Create countdown text
        const countdownText = this.add.text(gameWidth / 2, gameHeight / 2, countdownValue.toString(), {
            fontSize: Math.min(gameWidth * 0.2, 80) + 'px',
            fontFamily: 'raventure',
            fill: '#e74c3c',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create countdown timer
        const countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                countdownValue--;
                if (countdownValue > 0) {
                    countdownText.setText(countdownValue.toString());
                    // Scale animation for each number
                    this.tweens.add({
                        targets: countdownText,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 200,
                        yoyo: true,
                        ease: 'Back.easeOut'
                    });
                } else {
                    countdownText.setText('GO!');
                    countdownText.setFill('#27ae60');
                    
                    // Final animation
                    this.tweens.add({
                        targets: countdownText,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        alpha: 0,
                        duration: 800,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            countdownText.destroy();
                            // Start the actual game
                            this.gameState.startGame();
                        }
                    });
                    
                    countdownTimer.destroy();
                }
            },
            repeat: 4
        });
    }

    createNumbersPopup() {
        // Create popup button in rolling area
        const rollingArea = this.numberManager.rollingArea;
        this.numbersButton = this.add.circle(
            rollingArea.x + rollingArea.width - 30,
            rollingArea.y + 30,
            15,
            0x3498db
        ).setInteractive({ useHandCursor: true });

        this.add.text(
            rollingArea.x + rollingArea.width - 30,
            rollingArea.y + 30,
            '?',
            {
                fontSize: '18px',
                fontFamily: 'raventure',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Create popup container (initially hidden)
        this.numbersPopup = this.add.container(gameWidth / 2, gameHeight / 2);
        this.numbersPopup.setVisible(false);

        // Popup background
        const popupBg = this.add.rectangle(0, 0, gameWidth * 0.9, gameHeight * 0.8, 0x2c3e50, 0.95);
        popupBg.setStrokeStyle(4, 0x34495e).setDepth(2);

        this.numbersPopup.add(popupBg);

        // Title
        const title = this.add.text(0, -gameHeight * 0.35, 'Called Numbers', {
            fontSize: Math.min(gameWidth * 0.06, 24) + 'px',
            fontFamily: 'raventure',
            fill: '#ecf0f1'
        }).setOrigin(0.5);
        this.numbersPopup.add(title);

        // Close button
        const closeButton = this.add.circle(gameWidth * 0.4, -gameHeight * 0.35, 20, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        const closeX = this.add.text(gameWidth * 0.4, -gameHeight * 0.35, '×', {
            fontSize: '24px',
            fontFamily: 'raventure',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.numbersPopup.add([closeButton, closeX]);

        // Create number grid
        this.createNumberGrid();

        // Button events
        this.numbersButton.on('pointerdown', () => {
            this.showNumbersPopup();
        });

        closeButton.on('pointerdown', () => {
            this.hideNumbersPopup();
        });

        // Click outside to close
        popupBg.setInteractive();
        popupBg.on('pointerdown', (pointer, localX, localY) => {
            // Only close if clicked on background (not on numbers)
            if (Math.abs(localX) > gameWidth * 0.35 || Math.abs(localY) > gameHeight * 0.25) {
                this.hideNumbersPopup();
            }
        });
    }

    createNumberGrid() {
        this.numberCells = [];
        const startX = -gameWidth * 0.35;
        const startY = -gameHeight * 0.25;
        const cellSize = Math.min(gameWidth * 0.08, 40);
        const spacing = cellSize + 5;

        // // Create BINGO headers
        // const letters = ['B', 'I', 'N', 'G', 'O'];
        // letters.forEach((letter, col) => {
        //     const headerText = this.add.text(
        //         startX + col * spacing * 3 + spacing * 1.5,
        //         startY - 30,
        //         letter,
        //         {
        //             fontSize: Math.min(gameWidth * 0.04, 18) + 'px',
        //             fontFamily: 'raventure',
        //             fill: '#3498db'
        //         }
        //     ).setOrigin(0.5);
        //     this.numbersPopup.add(headerText);
        // });

        // Create number cells
        for (let num = 1; num <= 75; num++) {
            const col = Math.floor((num - 1) / 25);
            const row = (num - 1) % 15;
            
            const x = startX + col * spacing * 3 + (row % 3) * spacing;
            const y = startY + Math.floor(row / 3) * spacing;

            const cell = this.add.rectangle(x, y, cellSize, cellSize, 0x7f8c8d);
            cell.setStrokeStyle(2, 0x95a5a6);
            
            const numberText = this.add.text(x, y, num.toString(), {
                fontSize: Math.min(gameWidth * 0.03, 14) + 'px',
                fontFamily: 'raventure',
                fill: '#2c3e50'
            }).setOrigin(0.5);

            this.numbersPopup.add([cell, numberText]);
            this.numberCells[num] = { bg: cell, text: numberText };
        }
    }

    showNumbersPopup() {
        this.updateNumberGrid();
        this.numbersPopup.setVisible(true);
        
        // Fade in animation
        this.numbersPopup.setAlpha(0);
        this.tweens.add({
            targets: this.numbersPopup,
            alpha: 1,
            duration: 300,
            ease: 'Power2.easeOut'
        });
    }

    hideNumbersPopup() {
        this.tweens.add({
            targets: this.numbersPopup,
            alpha: 0,
            duration: 200,
            ease: 'Power2.easeIn',
            onComplete: () => {
                this.numbersPopup.setVisible(false);
            }
        });
    }

    updateNumberGrid() {
        if (!this.numberManager || !this.numberCells) return;

        const calledNumbers = this.numberManager.calledNumbers;
        const recentNumber = calledNumbers[calledNumbers.length - 1];

        // Reset all cells
        for (let num = 1; num <= 75; num++) {
            const cell = this.numberCells[num];
            if (cell) {
                if (calledNumbers.includes(num)) {
                    if (num === recentNumber) {
                        // Most recent number - highlight in green
                        cell.bg.setFillStyle(0x27ae60);
                        cell.text.setFill('#ffffff');
                    } else {
                        // Previously called numbers - mark in blue
                        cell.bg.setFillStyle(0x3498db);
                        cell.text.setFill('#ffffff');
                    }
                } else {
                    // Not called yet - default gray
                    cell.bg.setFillStyle(0x7f8c8d);
                    cell.text.setFill('#2c3e50');
                }
            }
        }
    }

    // Game event handlers
    onGameWon(winType) {
        this.gameState.winGame(winType);
    }

    toggleGame() {
        this.gameState.togglePause();
    }

    startNewGame() {
        this.gameState.resetGame();
    }

    goToMenu() {
        this.gameState.isGameActive = false;
        this.numberManager.stop();
        this.scene.start('MainMenu');
    }
}

 
