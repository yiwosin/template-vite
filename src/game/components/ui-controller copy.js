import { gameWidth, gameHeight } from '../config.js';

// UI Controller Class - manages game controls and interface
export class UIController extends Phaser.GameObjects.Container {
    
    constructor(scene) {
        super(scene);
        // this.scene.add.existing(this);
        this.pauseButton = null;
        this.pauseButtonText = null;
    }

    createInterface() {
        this.createHeader();
        this.createControls();
        this.createInstructions();
    }

    createHeader() {
        const centerX = gameWidth / 2;
        const headerHeight = gameHeight * 0.12;                
                

        this.scene.add.graphics()
        .fillStyle(0x08b3ff, 1)
        // .fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1)
        .fillRoundedRect(0, 0, gameWidth, headerHeight,  { tl: 0, tr: 0, bl: 22, br: 22 });
       
        // Logo
        this.scene.add.image(centerX,  headerHeight * 0.45, 'logo')
            .setScale(Math.min(0.1, 0.1)) // Scale logo to fit within the game width
            .setOrigin(0.5);
        // Back button - top left

        const backButton = this.scene.add.image(gameWidth * 0.10, headerHeight * 0.40, 'home')
        .setScale(0.4) // Scale home icon;
        .setInteractive({ useHandCursor: true });

        // Setting button - top right
        const settingButton = this.scene.add.image(gameWidth * 0.9, headerHeight * 0.40, 'setting')
        .setScale(0.4) // Scale home icon;
        .setInteractive({ useHandCursor: true });

        // this.scene.add.existing(this)

        backButton.on('pointerdown', () => this.scene.goToMenu());
    }

    createControls() {
        const buttonY = gameHeight * 0.85;
        const buttonWidth = gameWidth * 0.35;
        const buttonHeight = gameHeight * 0.06;

        // Pause/Resume button
        this.pauseButton = this.scene.add.rectangle(gameWidth * 0.3, buttonY, 
            buttonWidth, buttonHeight, 0xf39c12)
            .setInteractive({ useHandCursor: true });
        
        this.pauseButtonText = this.scene.add.text(gameWidth * 0.3, buttonY, 'PAUSE', {
            fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // New Game button
        const newGameButton = this.scene.add.rectangle(gameWidth * 0.7, buttonY, 
            buttonWidth, buttonHeight, 0xe67e22)
            .setInteractive({ useHandCursor: true });
        
        this.scene.add.text(gameWidth * 0.7, buttonY, 'NEW GAME', {
            fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button feedback
        [this.pauseButton, newGameButton].forEach(button => {
            button.on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: button,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true
                });
            });
        });

        // Button handlers
        this.pauseButton.on('pointerdown', () => this.scene.toggleGame());
        newGameButton.on('pointerdown', () => this.scene.startNewGame());
    }

    createInstructions() {
        this.scene.add.text(gameWidth / 2, gameHeight * 0.92, 
            'Tap called numbers on your card to mark them', {
            fontSize: Math.min(gameWidth * 0.03, 12) + 'px',
            fill: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    updatePauseButton(isPaused) {
        if (isPaused) {
            this.pauseButtonText.setText('RESUME');
            this.pauseButton.setFillStyle(0x27ae60);
        } else {
            this.pauseButtonText.setText('PAUSE');
            this.pauseButton.setFillStyle(0xf39c12);
        }
    }
}
