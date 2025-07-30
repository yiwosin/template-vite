// Game State Manager Class - manages overall game state
export class GameStateManager {
    /**
     * @param {Phaser.Scene} scene - The Phaser scene this manager belongs to  
     * This class handles the game state, including starting, pausing, resuming, and winning the game.
     * It also manages the game state transitions and interactions with other components like NumberManager, BingoCard, and UIController.
     **/
    constructor(scene) {
        this.scene = scene;
        this.isGameActive = false;
        this.isGameWon = false;
        this.isPaused = false;
    }

    startGame() {
        this.isGameActive = true;
        this.isGameWon = false;
        this.isPaused = false;
        this.scene.numberManager.start();
    }

    pauseGame() {
        this.isPaused = true;
        this.scene.numberManager.pause();
        this.scene.uiController.updatePauseButton(true);
    }

    resumeGame() {
        this.isPaused = false;
        this.scene.numberManager.resume();
        this.scene.uiController.updatePauseButton(false);
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    winGame(winType) {
        this.isGameWon = true;
        this.isGameActive = false;
        this.scene.numberManager.stop();
        this.scene.winChecker.showWinAnimation(winType);
    }

    resetGame() {
        this.isGameActive = false;
        this.isGameWon = false;
        this.isPaused = false;
        this.scene.numberManager.reset();
        this.scene.bingoCard.reset();
        this.scene.uiController.updatePauseButton(false);
        this.clearWinEffects();
        this.startGame();
    }

    clearWinEffects() {
        this.scene.children.list = this.scene.children.list.filter(child => {
            if (child.fillColor === 0x000000 || 
                (child.fillColor >= 0x000000 && child.fillColor <= 0xffffff && child.radius === 5)) {
                child.destroy();
                return false;
            }
            return true;
        });
    }
}