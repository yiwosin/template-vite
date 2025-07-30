import { gameWidth, gameHeight } from "../config";
// Win Checker Class - handles win detection and celebration
export class WinChecker {
    constructor(scene) {
        this.scene = scene;
    }

    checkForWin(card) {
        const winType = this.detectWin(card);
        if (winType) {
            this.scene.onGameWon(winType);
        }
    }

    detectWin(card) {
        // Check rows
        for (let row = 0; row < 5; row++) {
            let rowComplete = true;
            for (let col = 0; col < 5; col++) {
                if (!card[col][row].marked) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) return 'Row ' + (row + 1);
        }

        // Check columns
        for (let col = 0; col < 5; col++) {
            let colComplete = true;
            for (let row = 0; row < 5; row++) {
                if (!card[col][row].marked) {
                    colComplete = false;
                    break;
                }
            }
            if (colComplete) return 'Column ' + ['B', 'I', 'N', 'G', 'O'][col];
        }

        // Check diagonals
        let diagonal1 = true, diagonal2 = true;
        for (let i = 0; i < 5; i++) {
            if (!card[i][i].marked) diagonal1 = false;
            if (!card[i][4-i].marked) diagonal2 = false;
        }
        if (diagonal1 || diagonal2) return 'Diagonal';

        return null;
    }

    showWinAnimation(winType) {
        const overlay = this.scene.add.rectangle(gameWidth / 2, gameHeight / 2, 
            gameWidth, gameHeight, 0x000000, 0.8);
        
        this.scene.add.text(gameWidth / 2, gameHeight * 0.4, 'BINGO!', {
            fontSize: Math.min(gameWidth * 0.15, 60) + 'px',
            fontFamily: 'Arial Black',
            fill: '#e74c3c'
        }).setOrigin(0.5);

        this.scene.add.text(gameWidth / 2, gameHeight * 0.5, `${winType} Winner!`, {
            fontSize: Math.min(gameWidth * 0.06, 24) + 'px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.scene.add.text(gameWidth / 2, gameHeight * 0.6, 'Tap "NEW GAME" to play again', {
            fontSize: Math.min(gameWidth * 0.045, 18) + 'px',
            fill: '#bdc3c7'
        }).setOrigin(0.5);

        this.createFireworks();
    }

    createFireworks() {
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.circle(
                Phaser.Math.Between(50, gameWidth - 50),
                Phaser.Math.Between(100, gameHeight - 100),
                5,
                Phaser.Math.Between(0x000000, 0xffffff)
            );
            
            this.scene.tweens.add({
                targets: particle,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 2000,
                delay: i * 100
            });
        }
    }
}
