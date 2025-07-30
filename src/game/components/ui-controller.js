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
        .fillRoundedRect(0, 0, gameWidth, headerHeight,  { tl: 0, tr: 0, bl: 22, br: 22 });
   
        // Logo
        this.scene.add.image(centerX,  headerHeight * 0.45, 'logo')
            .setScale(Math.min(0.1, 0.1))
            .setOrigin(0.5);

        // Back button - top left
        const backButton = this.scene.add.image(gameWidth * 0.10, headerHeight * 0.40, 'home')
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

        // Setting button - top right
        const settingButton = this.scene.add.image(gameWidth * 0.9, headerHeight * 0.40, 'setting')
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => this.showQuitConfirmation());
    }

    showQuitConfirmation() {
        // Create overlay
        this.quitOverlay = this.scene.add.rectangle(gameWidth / 2, gameHeight / 2, 
            gameWidth, gameHeight, 0x000000, 0.7);

        // Create popup background
        this.quitPopup = this.scene.add.rectangle(gameWidth / 2, gameHeight / 2, 
            gameWidth * 0.8, gameHeight * 0.4, 0xffffff);
        this.quitPopup.setStrokeStyle(4, 0x2c3e50);

        // Title text
        this.quitTitle = this.scene.add.text(gameWidth / 2, gameHeight * 0.4, 'Quit Game?', {
            fontSize: Math.min(gameWidth * 0.08, 32) + 'px',
            fontFamily: 'Arial Black',
            fill: '#2c3e50'
        }).setOrigin(0.5);

        // Message text
        this.quitMessage = this.scene.add.text(gameWidth / 2, gameHeight * 0.5, 
            'Are you sure you want to quit?\nYour progress will be lost.', {
            fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
            fill: '#7f8c8d',
            align: 'center'
        }).setOrigin(0.5);

        // Yes button
        this.yesButton = this.scene.add.rectangle(gameWidth * 0.35, gameHeight * 0.6, 
            gameWidth * 0.25, gameHeight * 0.08, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        
        this.yesButtonText = this.scene.add.text(gameWidth * 0.35, gameHeight * 0.6, 'YES', {
            fontSize: Math.min(gameWidth * 0.05, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // No button
        this.noButton = this.scene.add.rectangle(gameWidth * 0.65, gameHeight * 0.6, 
            gameWidth * 0.25, gameHeight * 0.08, 0x95a5a6)
            .setInteractive({ useHandCursor: true });
        
        this.noButtonText = this.scene.add.text(gameWidth * 0.65, gameHeight * 0.6, 'NO', {
            fontSize: Math.min(gameWidth * 0.05, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button animations
        [this.yesButton, this.noButton].forEach(button => {
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
        this.yesButton.on('pointerdown', () => this.confirmQuit());
        this.noButton.on('pointerdown', () => this.cancelQuit());
    }

    confirmQuit() {
        this.hideQuitConfirmation();
        this.scene.goToMenu();
    }

    cancelQuit() {
        this.hideQuitConfirmation();
    }

    hideQuitConfirmation() {
        // Destroy all popup elements
        if (this.quitOverlay) this.quitOverlay.destroy();
        if (this.quitPopup) this.quitPopup.destroy();
        if (this.quitTitle) this.quitTitle.destroy();
        if (this.quitMessage) this.quitMessage.destroy();
        if (this.yesButton) this.yesButton.destroy();
        if (this.yesButtonText) this.yesButtonText.destroy();
        if (this.noButton) this.noButton.destroy();
        if (this.noButtonText) this.noButtonText.destroy();
    }

    createControls() {
        const buttonY = gameHeight * 0.85;
        const buttonWidth = gameWidth * 0.35;
        const buttonHeight = gameHeight * 0.06;

        // // Pause/Resume button
        // this.pauseButton = this.scene.add.rectangle(gameWidth * 0.3, buttonY, 
        //     buttonWidth, buttonHeight, 0xf39c12)
        //     .setInteractive({ useHandCursor: true });
        
        // this.pauseButtonText = this.scene.add.text(gameWidth * 0.3, buttonY, 'PAUSE', {
        //     fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
        //     fontFamily: 'Arial Black',
        //     fill: '#ffffff'
        // }).setOrigin(0.5);

        // // New Game button
        // const newGameButton = this.scene.add.rectangle(gameWidth * 0.7, buttonY, 
        //     buttonWidth, buttonHeight, 0xe67e22)
        //     .setInteractive({ useHandCursor: true });
        
        // this.scene.add.text(gameWidth * 0.7, buttonY, 'NEW GAME', {
        //     fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
        //     fontFamily: 'Arial Black',
        //     fill: '#ffffff'
        // }).setOrigin(0.5);

        // // Button feedback
        // [this.pauseButton, newGameButton].forEach(button => {
        //     button.on('pointerdown', () => {
        //         this.scene.tweens.add({
        //             targets: button,
        //             scaleX: 0.95,
        //             scaleY: 0.95,
        //             duration: 100,
        //             yoyo: true
        //         });
        //     });
        // });

        // // Button handlers
        // this.pauseButton.on('pointerdown', () => this.scene.toggleGame());
        // newGameButton.on('pointerdown', () => this.scene.startNewGame());
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
