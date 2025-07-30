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
        this.scene.add.graphics()
        .fillStyle(0x34495e, 1)
        .fillRoundedRect(this.rollingArea.x, this.rollingArea.y, 
            this.rollingArea.width, this.rollingArea.height,  
            { tl: 22, tr: 22, bl: 22, br: 22 });  


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
        this.scene.bingoCard.highlightNumber(calledNumber);

        this.timer = this.scene.time.delayedCall(
            Phaser.Math.Between(3000, 5000),
            this.rollNextNumber,
            [],
            this
        );
    }

    createRollingNumber(number) {

        const letter = this.getNumberLetter(number);
        const container = this.scene.add.container(0, 0);
        
        // const bg = this.scene.add.circle(0, 0, gameWidth * 0.08, this.letterColors[letter]);
        // Background circle
        // const bg = this.scene.add.image(0, 0, gameWidth * 0.04, this.letterColors[letter]);
        const bg = this.scene.add.image(0, 0, this.letterColors[letter])
            .setDisplaySize(this.rollingArea.height, this.rollingArea.height)
            .setOrigin(0.5);
        // const letterText = this.scene.add.text(-5, -15, letter, {
        //     fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
        //     fontFamily: 'Arial Black',
        //     fill: '#ffffff'
        // }).setOrigin(0.5);

        const numberText = this.scene.add.text(0, 4, number, {
            fontSize: Math.min(gameWidth * 0.06, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#2a2727ff'
        }).setOrigin(0.5);

        container.add([bg, numberText]);
        // Start position (off screen)
        container.setPosition(this.rollingArea.x + this.rollingArea.width * 0.04
            , this.rollingArea.y + this.rollingArea.height * 0.5);  

        this.animateRollingNumber(container);
        this.rollingNumbers.push({ container, number, letter });
    }

    animateRollingNumber(container) {
        // Calculate final position based on number of existing balls
        const ballIndex = this.rollingNumbers.length - 1;
        const ballSpacing = this.rollingArea.height * 1.2;
        const finalX = this.rollingArea.x + (ballIndex * ballSpacing) + ballSpacing;

        this.scene.tweens.add({
            targets: container,
            x: finalX,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Pause in position
                this.scene.time.delayedCall(1500, () => {
                    // Only move out if we have 4 or more balls
                    if (this.rollingNumbers.length >= 4) {
                        // Move out the oldest ball (first in array)
                        const oldestBall = this.rollingNumbers[0];
                        if (oldestBall && oldestBall.container) {
                            this.scene.tweens.add({
                                targets: oldestBall.container,
                                x: this.rollingArea.x + this.rollingArea.width + 50,
                                duration: 1000,
                                ease: 'Power2.easeIn',
                                onComplete: () => {
                                    oldestBall.container.destroy();
                                    // Remove from array
                                    this.rollingNumbers.shift();
                                    // Reposition remaining balls
                                    this.repositionBalls();
                                }
                            });
                        }
                    }
                });
            }
        });

        this.scene.tweens.add({
            targets: container,
            scaleX: 1.7,
            scaleY: 1.7,
            duration: 500,
            delay: 1000,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }

    repositionBalls() {
        const ballSpacing = this.rollingArea.height * 1.2;
        
        this.rollingNumbers.forEach((ballObj, index) => {
            if (ballObj.container) {
                const newX = this.rollingArea.x + (index * ballSpacing) + ballSpacing;
                this.scene.tweens.add({
                    targets: ballObj.container,
                    x: newX,
                    duration: 300,
                    ease: 'Power2.easeOut'
                });
            }
        });
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

    clearRollingNumbers() {
        this.rollingNumbers.forEach(numberObj => {
            if (numberObj.container) {
                numberObj.container.destroy();
            }
        });
        this.rollingNumbers = [];
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
