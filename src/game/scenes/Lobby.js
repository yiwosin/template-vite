import { Scene } from 'phaser';
import { gameWidth, gameHeight } from '../config.js';

export class Lobby extends Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Background
        this.add.image(centerX, centerY, 'background');

        // Title
        this.add.text(centerX, gameHeight * 0.2, 'Choose Your Cards', {
            fontSize: Math.min(gameWidth * 0.08, 32) + 'px',
            fontFamily: 'Arial Black',
            fill: '#2c3e50'
        }).setOrigin(0.5);

        // 1 Card Option
        const oneCardButton = this.add.image(centerX, gameHeight * 0.4, 'button-bg')
            .setInteractive({ useHandCursor: true })
            .setScale(1.2, 1)
            .setOrigin(0.5);

        this.add.text(centerX, gameHeight * 0.4, 'PLAY WITH 1 CARD', {
            fontSize: Math.min(gameWidth * 0.06, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 2 Cards Option
        const twoCardsButton = this.add.image(centerX, gameHeight * 0.6, 'button-bg')
            .setInteractive({ useHandCursor: true })
            .setScale(1.2, 1)
            .setOrigin(0.5);

        this.add.text(centerX, gameHeight * 0.6, 'PLAY WITH 2 CARDS', {
            fontSize: Math.min(gameWidth * 0.06, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Back button
        const backButton = this.add.image(gameWidth * 0.1, gameHeight * 0.1, 'home')
            .setScale(0.4)
            .setInteractive({ useHandCursor: true });

        // Button animations
        [oneCardButton, twoCardsButton].forEach(button => {
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scaleX: 1.1,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true
                });
            });
        });

        // Button handlers
        oneCardButton.on('pointerdown', () => {
            this.registry.set('numberOfCards', 1);
            this.cameras.main.fade(200, 0, 0, 0);
            this.time.delayedCall(200, () => this.scene.start('GameScene'));
        });

        twoCardsButton.on('pointerdown', () => {
            this.registry.set('numberOfCards', 2);
            this.cameras.main.fade(200, 0, 0, 0);
            this.time.delayedCall(200, () => this.scene.start('GameScene'));
        });

        backButton.on('pointerdown', () => {
            this.cameras.main.fade(200, 0, 0, 0);
            this.time.delayedCall(200, () => this.scene.start('MainMenu'));
        });
    }
}