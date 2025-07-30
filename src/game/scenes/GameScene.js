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
        // Initialize background
        this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0xF8FAFC);

        // Initialize all components
        this.bingoCard = new BingoCardWithBackground(this, 200,300);
        this.numberManager = new NumberManager(this);
        this.winChecker = new WinChecker(this);
        this.uiController = new UIController(this);
        this.gameState = new GameStateManager(this);

        

        

        // Setup game components
        this.setupGame();
        // Start the game
        this.gameState.startGame();
                        
    }

    setupGame() {
        

        // Generate and display bingo card
        this.bingoCard.generate();
        this.bingoCard.createDisplay('bingo-card');

        // Initialize number manager
        this.numberManager.initialize();

        // Create UI
        this.uiController.createInterface();

        
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

 