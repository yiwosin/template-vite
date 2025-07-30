import { Scene } from 'phaser';
import { ScreeComponent } from '../components/screen-component.js';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const screenSize = new ScreeComponent();
        const gameWidth = screenSize.width();
        const gameHeight = screenSize.height();
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

                // Background
        this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x08b3ff);
                
        // Logo
        this.add.image(centerX,  gameHeight * 0.25, 'logo')
            .setScale(Math.min(0.4, 0.4)) // Scale logo to fit within the game width
            .setOrigin(0.5);


        // // Subtitle
        // this.add.text(centerX, gameHeight * 0.45, 'Auto Rolling Numbers!', {
        //     fontSize: Math.min(gameWidth * 0.055, 22) + 'px',
        //     fontFamily: 'Arial Black',
        //     fill: '#0f1112ff'
        // }).setOrigin(0.5);

        // Play button - larger for mobile
        const buttonWidth = gameWidth * 0.6;
        const buttonHeight = gameHeight * 0.08;
        // const playButton = this.add.rectangle(centerX, gameHeight * 0.5, buttonWidth, buttonHeight, 0xe74c3c)
        //     .setInteractive({ useHandCursor: true });
        // this.add.text(centerX, gameHeight * 0.5, 'START GAME', {
        //             fontSize: Math.min(gameWidth * 0.08, 28) + 'px',
        //             fontFamily: 'Arial Black',
        //             fill: '#ffffff'
        //         }).setOrigin(0.5);

        const playButton = this.add.image(centerX, gameHeight * 0.55, 'button-bg').setInteractive({ useHandCursor: true })
        .setScale(1, 1) // Scale button image
        .setOrigin(0.5);

         this.add.text(centerX, gameHeight * 0.55, 'PLAY', {
                    fontSize: Math.min(gameWidth * 0.07, 28) + 'px',
                    fontFamily: 'Arial Black',
                    fill: '#ffffff'
                }).setOrigin(0.5);


                
               

        // Instructions - updated for new mechanic
        // this.add.text(centerX, gameHeight * 0.7, 'Numbers automatically roll in!\nTap them on your card\nto mark them.\nGet 5 in a row to win!', {
        //     fontSize: Math.min(gameWidth * 0.045, 18) + 'px',
        //     fill: '#070808ff',
        //     align: 'center',
        //     lineSpacing: 8
        // }).setOrigin(0.5);

        // Button effects
        // playButton.on('pointerover', () => playButton.setFillStyle(0xc0392b));
        // playButton.on('pointerout', () => playButton.setFillStyle(0xe74c3c));
        playButton.on('pointerdown', () => {
            this.cameras.main.fade(200, 0, 0, 0);
            this.time.delayedCall(200, () => this.scene.start('GameScene'));
        });
        
    }
}
