import { gameWidth, gameHeight } from '../config.js';
// Number Manager Class - handles number calling and rolling animations

export class NumberManager {
    constructor(scene) {
        this.scene = scene;
        this.calledNumbers = [];
        this.rollingNumbers = [];
        this.timer = null;
        this.isActive = false;
        this.rollingArea = null;
        this.historyText = null;
        
        this.letterColors = {
            'B': 'ball_b', 'I': 'ball_i', 'N': 'ball_n',
            'G': 'ball_g', 'O': 'ball_o'
        };
    }

    initialize() {
        const centerX = gameWidth / 2;
        const headerHeight = gameHeight * 0.12;
        
        this.rollingArea = {
            x: gameWidth * 0.10,
            y: headerHeight + 10,
            width: gameWidth * 0.8,
            height: gameHeight * 0.08
        };

        // Rolling area background
        // Rounded rectangle for rolling area
        this.scene.add.image(this.rollingArea.x, this.rollingArea.y, 'rolling_area')
            .setDisplaySize(this.rollingArea.width, this.rollingArea.height)
            .setOrigin(0, 0);
        // this.scene.add.graphics()
        // .fillStyle(0x34495e, 1)
        // .fillRoundedRect(this.rollingArea.x, this.rollingArea.y, 
        //     this.rollingArea.width, this.rollingArea.height,  
        //     { tl: 22, tr: 22, bl: 22, br: 22 });  


        this.historyText = this.scene.add.text(centerX, this.rollingArea.y + this.rollingArea.height * 1.3, '', {
            fontSize: Math.min(gameWidth * 0.03, 12) + 'px',
            fill: '#13bb6dff',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);
    }

    start() {
        this.isActive = true;
        this.rollNextNumber();
    }

    pause() {
        this.isActive = false;
        if (this.timer) {
            this.timer.destroy();
            this.timer = null;
        }
    }

    resume() {
        this.isActive = true;
        this.rollNextNumber();
    }

    stop() {
        this.pause();
        this.clearRollingNumbers();
    }

    rollNextNumber() {
        if (!this.isActive) return;

        const availableNumbers = [];
        for (let i = 1; i <= 75; i++) {
            if (!this.calledNumbers.includes(i)) {
                availableNumbers.push(i);
            }
        }

        if (availableNumbers.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const calledNumber = availableNumbers[randomIndex];
        this.calledNumbers.push(calledNumber);

        this.createRollingNumber(calledNumber);
        this.updateHistory();
        
        // Highlight number on all cards
        this.highlightNumberOnCards(calledNumber);

        // Update popup if it's visible
        if (this.scene.numbersPopup && this.scene.numbersPopup.visible) {
            this.scene.updateNumberGrid();
        }

        this.timer = this.scene.time.delayedCall(
            Phaser.Math.Between(3000, 5000),
            this.rollNextNumber,
            [],
            this
        );
    }

    highlightNumberOnCards(number) {
        // Handle single card
        if (this.scene.bingoCard) {
            this.scene.bingoCard.highlightNumber(number);
        }
        
        // Handle multiple cards
        if (this.scene.bingoCard1) {
            this.scene.bingoCard1.highlightNumber(number);
        }
        if (this.scene.bingoCard2) {
            this.scene.bingoCard2.highlightNumber(number);
        }
    }

    createRollingNumber(number) {
        const letter = this.getNumberLetter(number);
        
        // Clear previous rolling numbers to keep it simple
        this.clearRollingNumbers();
        
        // Create single centered number display
        const container = this.scene.add.container(0, 0);
        
        const bg = this.scene.add.image(0, 0, this.letterColors[letter])
            .setDisplaySize(this.rollingArea.height * 0.9, this.rollingArea.height * 0.9)
            .setOrigin(0.5);

        const numberText = this.scene.add.text(0, 4, number, {
            fontSize: Math.min(gameWidth * 0.08, 28) + 'px',
            fontFamily: 'Arial Black',
            fill: '#2a2727ff'
        }).setOrigin(0.5);

        container.add([bg, numberText]);
        
        // Position in center of rolling area
        container.setPosition(
            this.rollingArea.x + this.rollingArea.width * 0.5,
            this.rollingArea.y + this.rollingArea.height * 0.5
        );

        // Simple entrance animation
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Store current number
        this.currentNumber = { container, number, letter };
    }

    clearRollingNumbers() {
        // Clear current number display
        if (this.currentNumber && this.currentNumber.container) {
            this.currentNumber.container.destroy();
            this.currentNumber = null;
        }
        
        // Clear any remaining rolling numbers
        this.rollingNumbers.forEach(numberObj => {
            if (numberObj.container) {
                numberObj.container.destroy();
            }
        });
        this.rollingNumbers = [];
    }

    getNumberLetter(number) {
        if (number <= 15) return 'B';
        if (number <= 30) return 'I';
        if (number <= 45) return 'N';
        if (number <= 60) return 'G';
        return 'O';
    }

    updateHistory() {
        const recent = this.calledNumbers.slice(-6).join(' • ');
        this.historyText.setText('Recent: ' + recent);
    }

    isNumberCalled(number) {
        return this.calledNumbers.includes(number);
    }

    reset() {
        this.stop();
        this.calledNumbers = [];
        this.historyText.setText('');
    }
}
