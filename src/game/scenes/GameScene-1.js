import { Scene } from 'phaser';
import { ScreeComponent } from '../components/screen-component.js';

export class GameScene extends Scene
{
    gameWidth;
    gameHeight;
    rollingArea;
    headerHeight;
    constructor ()
    {
        
        super({ key: 'GameScene' });
        this.bingoCard = [];
        this.calledNumbers = [];
        this.gameWon = false;
        this.numberRollTimer = null;
        this.gameStarted = false;
        this.rollingNumbers = [];
        this.currentRollingNumber = null;

        this.screenSize = new ScreeComponent();
        this.gameWidth = this.screenSize.width();
        this.gameHeight = this.screenSize.height();
        this.headerHeight = this.gameHeight * 0.20;
        this.rollingArea = {
            x: this.gameWidth * 0.10,
            y: this.headerHeight - this.gameHeight * 0.03,
            width: this.gameWidth * 0.8,
            height: this.gameHeight * 0.08
        };
    }


    create() {
        const centerX = this.gameWidth / 2;
        
        // Background
        // F8FAFC
        // 0xF6F6F6
        this.add.rectangle(centerX, this.gameHeight / 2, this.gameWidth, this.gameHeight, 0xF8FAFC);

        // Header area
        
        this.add.graphics()
        .fillStyle(0x08b3ff, 1)
        .fillRoundedRect(0, 0, this.gameWidth, this.headerHeight,  { tl: 0, tr: 0, bl: 22, br: 22 });
        
    
        // Logo
        this.add.image(centerX,  this.headerHeight * 0.45, 'logo')
            .setScale(Math.min(0.1, 0.1)) // Scale logo to fit within the game width
            .setOrigin(0.5);
        // Back button - top left
        const backButton = this.add.image(this.gameWidth * 0.10, this.headerHeight * 0.40, 'home')
        .setScale(0.4) // Scale home icon;
        .setInteractive({ useHandCursor: true });
        // Setting button - top right
        const settingButton = this.add.image(this.gameWidth * 0.9, this.headerHeight * 0.40, 'setting')
        .setScale(0.4) // Scale home icon;
        .setInteractive({ useHandCursor: true });


        // Back button - top left
        // const backButton = this.add.rectangle(this.gameWidth * 0.15, this.headerHeight * 0.35, 
        //     this.gameWidth * 0.2, this.headerHeight * 0.4, 0x95a5a6)
        //     .setInteractive({ useHandCursor: true });
        
        // this.add.text(this.gameWidth * 0.15, this.headerHeight * 0.35, 'MENU', {
        //     fontSize: Math.min(this.gameWidth * 0.035, 14) + 'px',
        //     fill: '#ffffff'
        // }).setOrigin(0.5);

        backButton.on('pointerdown', () => {
            this.stopGame();
            this.scene.start('MainMenu');
        });

        // Generate and display bingo card
        this.generateBingoCard();
        this.createBingoCardDisplay();

        // Rolling number area - top of screen
        // this.rollingArea = {
        //     x: this.gameWidth * 0.10,
        //     y: this.headerHeight - this.gameHeight * 0.03,
        //     width: this.gameWidth * 0.8,
        //     height: this.gameHeight * 0.08
        // };

        // Rolling area background
        // this.add.rectangle(this.rollingArea.x, this.rollingArea.y, 
        //     this.rollingArea.width, this.rollingArea.height, 0x34495e, 0.5)
        //     .setStrokeStyle(2, 0x7f8c8d);
        
        this.add.graphics()
        .fillStyle(0x34495e, 1)
        .fillRoundedRect(this.rollingArea.x, this.rollingArea.y, 
            this.rollingArea.width, this.rollingArea.height,  
            { tl: 22, tr: 22, bl: 22, br: 22 });    

        // this.add.text(this.rollingArea.x, this.rollingArea.y - this.rollingArea.height * 0.4, 
        //     'Rolling Numbers', {
        //     fontSize: Math.min(this.gameWidth * 0.04, 16) + 'px',
        //     fill: '#ecf0f1',
        //     fontWeight: 'bold'
        // }).setOrigin(0.5);

        // Called numbers history - compact display
        this.calledNumbersText = this.add.text(centerX, this.rollingArea.y + this.rollingArea.height * 1.3, '', {
            fontSize: Math.min(this.gameWidth * 0.03, 12) + 'px',
            fill: '#13bb6dff',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);

        // Control buttons
        this.createMobileControls();

        // Start the number rolling automatically
        this.startNumberRolling();
    }

    generateBingoCard() {
        const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
        this.bingoCard = [];
        
        for (let col = 0; col < 5; col++) {
            const column = [];
            const [min, max] = ranges[col];
            const availableNumbers = [];
            
            for (let i = min; i <= max; i++) {
                availableNumbers.push(i);
            }
            
            for (let row = 0; row < 5; row++) {
                if (col === 2 && row === 2) {
                    column.push({ number: 'FREE', marked: true });
                } else {
                    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                    const number = availableNumbers.splice(randomIndex, 1)[0];
                    column.push({ number: number, marked: false });
                }
            }
            
            this.bingoCard.push(column);
        }
    }

    createBingoCardDisplay() {
        // Card positioning - centered and mobile optimized
        const cardSize = Math.min(this.gameWidth * 0.85, this.gameHeight * 0.4);
        const cellSize = cardSize / 5;
        const startX = (this.gameWidth - cardSize) / 2 + cellSize / 2;
        const startY = this.gameHeight * 0.5;
        
        const letters = ['B', 'I', 'N', 'G', 'O'];

        // Draw column headers
        for (let col = 0; col < 5; col++) {
            const x = startX + col * cellSize;
            this.add.rectangle(x, startY - cellSize * 0.4, cellSize * 0.9, cellSize * 0.3, 0xe74c3c);
            this.add.text(x, startY - cellSize * 0.4, letters[col], {
                fontSize: Math.min(cellSize * 0.4, 20) + 'px',
                fontFamily: 'Arial Black',
                fill: '#ffffff'
            }).setOrigin(0.5);
        }

        // Draw bingo card cells
        this.cardCells = [];
        for (let col = 0; col < 5; col++) {
            this.cardCells[col] = [];
            for (let row = 0; row < 5; row++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;
                const cell = this.bingoCard[col][row];
                
                // Cell background
                const cellBg = this.add.rectangle(x, y, cellSize * 0.9, cellSize * 0.9, 
                    cell.marked ? 0x27ae60 : 0xecf0f1)
                    .setInteractive({ useHandCursor: true });
                
                // Cell text
                const fontSize = cell.number === 'FREE' ? cellSize * 0.2 : cellSize * 0.35;
                const cellText = this.add.text(x, y, cell.number, {
                    fontSize: Math.min(fontSize, 18) + 'px',
                    fontFamily: 'Arial Black',
                    fill: cell.marked ? '#ffffff' : '#2c3e50'
                }).setOrigin(0.5);

                this.cardCells[col][row] = { bg: cellBg, text: cellText };

                // Touch handler for marking cells
                cellBg.on('pointerdown', () => {
                    if (!cell.marked && cell.number !== 'FREE' && 
                        this.calledNumbers.includes(cell.number)) {
                        cell.marked = true;
                        cellBg.setFillStyle(0x27ae60);
                        cellText.setFill('#ffffff');
                        
                        // Success animation
                        this.tweens.add({
                            targets: [cellBg, cellText],
                            scaleX: 1.2,
                            scaleY: 1.2,
                            duration: 200,
                            yoyo: true,
                            ease: 'Back.easeOut'
                        });
                        
                        this.checkForWin();
                    }
                });
            }
        }
    }

    createMobileControls() {
        const buttonY = this.gameHeight * 0.85;
        const buttonWidth = this.gameWidth * 0.35;
        const buttonHeight = this.gameHeight * 0.06;

        // Pause/Resume button
        this.pauseButton = this.add.rectangle(this.gameWidth * 0.3, buttonY, buttonWidth, buttonHeight, 0xf39c12)
            .setInteractive({ useHandCursor: true });
        
        this.pauseButtonText = this.add.text(this.gameWidth * 0.3, buttonY, 'PAUSE', {
            fontSize: Math.min(this.gameWidth * 0.04, 16) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // New Game button
        const newGameButton = this.add.rectangle(this.gameWidth * 0.7, buttonY, buttonWidth, buttonHeight, 0xe67e22)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(this.gameWidth * 0.7, buttonY, 'NEW GAME', {
            fontSize: Math.min(this.gameWidth * 0.04, 16) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button feedback
        [this.pauseButton, newGameButton].forEach(button => {
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true
                });
            });
        });

        // Button functionality
        this.pauseButton.on('pointerdown', () => {
            this.toggleGame();
        });

        newGameButton.on('pointerdown', () => {
            this.startNewGame();
        });

        // Instructions
        this.add.text(this.gameWidth / 2, this.gameHeight * 0.92, 'Tap called numbers on your card to mark them', {
            fontSize: Math.min(this.gameWidth * 0.03, 12) + 'px',
            fill: '#bdc3c7',
            align: 'center'
        }).setOrigin(0.5);
    }

    startNumberRolling() {
        this.gameStarted = true;
        this.rollNextNumber();
    }

    stopGame() {
        this.gameStarted = false;
        if (this.numberRollTimer) {
            this.numberRollTimer.destroy();
            this.numberRollTimer = null;
        }
        
        // Clear any rolling numbers
        this.rollingNumbers.forEach(numberObj => {
            if (numberObj.container) {
                numberObj.container.destroy();
            }
        });
        this.rollingNumbers = [];
    }

    toggleGame() {
        if (this.gameStarted) {
            this.gameStarted = false;
            this.pauseButtonText.setText('RESUME');
            this.pauseButton.setFillStyle(0x27ae60);
            
            if (this.numberRollTimer) {
                this.numberRollTimer.destroy();
                this.numberRollTimer = null;
            }
        } else {
            this.gameStarted = true;
            this.pauseButtonText.setText('PAUSE');
            this.pauseButton.setFillStyle(0xf39c12);
            this.rollNextNumber();
        }
    }

    rollNextNumber() {
        if (!this.gameStarted || this.gameWon) return;

        // Get available numbers
        const allNumbers = [];
        for (let i = 1; i <= 75; i++) {
            if (!this.calledNumbers.includes(i)) {
                allNumbers.push(i);
            }
        }

        if (allNumbers.length === 0) return;

        // Pick random number
        const randomIndex = Math.floor(Math.random() * allNumbers.length);
        const calledNumber = allNumbers[randomIndex];
        this.calledNumbers.push(calledNumber);

        // Create rolling number display
        this.createRollingNumber(calledNumber);

        // Update history
        this.updateCalledNumbersDisplay();

        // Highlight on card
        this.highlightCalledNumber(calledNumber);

        // Schedule next number
        this.numberRollTimer = this.time.delayedCall(
            Phaser.Math.Between(3000, 5000), // Random delay between 3-5 seconds
            this.rollNextNumber,
            [],
            this
        );
    }

    createRollingNumber(number) {
        // Determine letter based on number
        let letter;
        if (number <= 15) letter = 'B';
        else if (number <= 30) letter = 'I';
        else if (number <= 45) letter = 'N';
        else if (number <= 60) letter = 'G';
        else letter = 'O';

        // Create container for the rolling number
        const container = this.add.container(this.rollingArea.x,this.rollingArea.y);
        
        // Background circle
        const bg = this.add.circle(0, 0, this.gameWidth * 0.04, this.getLetterColor(letter));
        
        // Letter text
        const letterText = this.add.text(-5, -15, letter, {
            fontSize: Math.min(this.gameWidth * 0.04, 16) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Number text
        const numberText = this.add.text(0, 8, number, {
            fontSize: Math.min(this.gameWidth * 0.04, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, letterText, numberText]);

        // Start position (off screen)
        container.setPosition(this.rollingArea.x + this.rollingArea.width * 0.04
            , this.rollingArea.y + this.rollingArea.height * 0.5);

        // Rolling animation
        this.tweens.add({
            targets: container,
            x: this.rollingArea.x + this.rollingArea.width * 0.04,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Pause in center, then continue
                this.time.delayedCall(1500, () => {
                    this.tweens.add({
                        targets: container,
                        x: this.rollingArea.width +  this.rollingArea.width * 0.54,
                        duration: 1000,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            container.destroy();
                        }
                    });
                });
            }
        });

        // Add bounce effect when in center
        this.tweens.add({
            targets: container,
            scaleX: 1.7,
            scaleY: 1.7,
            duration: 700,
            delay: 1000,
            yoyo: true,
            ease: 'Back.easeOut'
        });

        // Store reference
        this.rollingNumbers.push({ container, number, letter });
    }

    getLetterColor(letter) {
        const colors = {
            'B': 0x3498db, // Blue
            'I': 0x9b59b6, // Purple
            'N': 0xe74c3c, // Red
            'G': 0x27ae60, // Green
            'O': 0xf39c12  // Orange
        };
        return colors[letter];
    }

    highlightCalledNumber(number) {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                if (this.bingoCard[col][row].number === number && 
                    !this.bingoCard[col][row].marked) {
                    const cell = this.cardCells[col][row];
                    
                    // Glowing highlight effect
                    this.tweens.add({
                        targets: cell.bg,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 800,
                        yoyo: true,
                        repeat: 2,
                        ease: 'Sine.easeInOut'
                    });

                    // Color pulse
                    this.tweens.add({
                        targets: cell.bg,
                        alpha: 0.7,
                        duration: 400,
                        yoyo: true,
                        repeat: 4
                    });
                }
            }
        }
    }

    updateCalledNumbersDisplay() {
        const recentNumbers = this.calledNumbers.slice(-6).join(' • ');
        this.calledNumbersText.setText('Recent: ' + recentNumbers);
    }

    checkForWin() {
        let winType = null;

        // Check rows
        for (let row = 0; row < 5; row++) {
            let rowComplete = true;
            for (let col = 0; col < 5; col++) {
                if (!this.bingoCard[col][row].marked) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                winType = 'Row ' + (row + 1);
                break;
            }
        }

        // Check columns
        if (!winType) {
            for (let col = 0; col < 5; col++) {
                let colComplete = true;
                for (let row = 0; row < 5; row++) {
                    if (!this.bingoCard[col][row].marked) {
                        colComplete = false;
                        break;
                    }
                }
                if (colComplete) {
                    winType = 'Column ' + ['B', 'I', 'N', 'G', 'O'][col];
                    break;
                }
            }
        }

        // Check diagonals
        if (!winType) {
            let diagonal1 = true, diagonal2 = true;
            for (let i = 0; i < 5; i++) {
                if (!this.bingoCard[i][i].marked) diagonal1 = false;
                if (!this.bingoCard[i][4-i].marked) diagonal2 = false;
            }
            if (diagonal1 || diagonal2) winType = 'Diagonal';
        }

        if (winType) this.winGame(winType);
    }

    winGame(winType) {
        this.gameWon = true;
        this.stopGame();

        // Win overlay
        const overlay = this.add.rectangle(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth, this.gameHeight, 0x000000, 0.8);
        
        this.add.text(this.gameWidth / 2, this.gameHeight * 0.4, 'BINGO!', {
            fontSize: Math.min(this.gameWidth * 0.15, 60) + 'px',
            fontFamily: 'Arial Black',
            fill: '#e74c3c'
        }).setOrigin(0.5);

        this.add.text(this.gameWidth / 2, this.gameHeight * 0.5, `${winType} Winner!`, {
            fontSize: Math.min(this.gameWidth * 0.06, 24) + 'px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.gameWidth / 2, this.gameHeight * 0.6, 'Tap "NEW GAME" to play again', {
            fontSize: Math.min(this.gameWidth * 0.045, 18) + 'px',
            fill: '#bdc3c7'
        }).setOrigin(0.5);

        // Fireworks effect
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(50, this.gameWidth - 50),
                Phaser.Math.Between(100, this.gameHeight - 100),
                5,
                Phaser.Math.Between(0x000000, 0xffffff)
            );
            
            this.tweens.add({
                targets: particle,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 2000,
                delay: i * 100
            });
        }
    }

    startNewGame() {
        this.gameWon = false;
        this.calledNumbers = [];
        this.stopGame();

        this.calledNumbersText.setText('');
        this.pauseButtonText.setText('PAUSE');
        this.pauseButton.setFillStyle(0xf39c12);

        this.generateBingoCard();
        
        // Update card display
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                const cell = this.bingoCard[col][row];
                const displayCell = this.cardCells[col][row];
                
                displayCell.text.setText(cell.number);
                displayCell.bg.setFillStyle(cell.marked ? 0x27ae60 : 0xecf0f1);
                displayCell.text.setFill(cell.marked ? '#ffffff' : '#2c3e50');
                displayCell.bg.setAlpha(1);
                displayCell.bg.setScale(1);
            }
        }

        // Clear win effects
        this.children.list = this.children.list.filter(child => {
            if (child.fillColor === 0x000000 || 
                (child.fillColor >= 0x000000 && child.fillColor <= 0xffffff && child.radius === 5)) {
                child.destroy();
                return false;
            }
            return true;
        });

        // Start new game
        this.startNumberRolling();
    }
}
