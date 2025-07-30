import { gameWidth, gameHeight } from '../config.js';

export class BingoCardWithBackground {
    constructor(scene, x = 0, y = 0) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.card = [];
        this.cardCells = [];
        this.container = null;
        this.ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
        this.letters = ['B', 'I', 'N', 'G', 'O'];
        this.backgroundImage = null;
    }

    generate() {
        this.card = [];
        
        for (let col = 0; col < 5; col++) {
            const column = [];
            const [min, max] = this.ranges[col];
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
            
            this.card.push(column);
        }
    }

    createDisplay(backgroundKey = 'card-background') {
        // Create container for the entire card
        this.container = this.scene.add.container(this.x, this.y);

        const cardSize = Math.min(gameWidth * 0.85, gameHeight * 0.4);
        const cellSize = cardSize / 5;

        // Add background image
        if (this.scene.textures.exists(backgroundKey)) {
            this.backgroundImage = this.scene.add.image(0, 0, backgroundKey);
            this.backgroundImage.setDisplaySize(cardSize * 1, cardSize * 1.2);
            this.container.add(this.backgroundImage);
        } else {
            // Fallback: create a styled background
            const bg = this.scene.add.rectangle(0, 0, cardSize * 1.1, cardSize * 1.1, 0xffffff);
            bg.setStrokeStyle(4, 0x2c3e50);
            this.container.add(bg);
        }

        // const letterColors = [0x9b59b6, 0x3498db, 0x27ae60, 0xf39c12, 0xe74c3c];
        
        // // Draw column headers
        // for (let col = 0; col < 5; col++) {
        //     const x = (col - 2) * cellSize;
        //     const y = -cellSize * 2.5;
            
        //     const headerBg = this.scene.add.rectangle(x, y, cellSize * 0.9, cellSize * 0.3, letterColors[col]);
        //     const headerText = this.scene.add.text(x, y, this.letters[col], {
        //         fontSize: Math.min(cellSize * 0.4, 20) + 'px',
        //         fontFamily: 'Arial Black',
        //         fill: '#ffffff'
        //     }).setOrigin(0.5);

        //     this.container.add([headerBg, headerText]);
        // }

        // Draw bingo card cells
        this.cardCells = [];

        for (let col = 0; col < 5; col++) {
            this.cardCells[col] = [];
            for (let row = 0; row < 5; row++) {
                const x = (col - 2.05) * cellSize;
                const y = (row - 2.2) * cellSize;
                const cell = this.card[col][row];
                
                const cellBg = this.scene.add.rectangle(x, y, cellSize * 0.95, cellSize * 0.95, 
                    cell.marked ? 0x27ae60 : 0xecf0f1).setAlpha(0)
                    .setInteractive({ useHandCursor: true });
                
                const fontSize = cell.number === 'FREE' ? cellSize * 0.2 : cellSize * 0.35;
                const cellText = this.scene.add.text(x, y, cell.number, {
                    fontSize: Math.min(fontSize, 18) + 'px',
                    fontFamily: 'Arial Black',
                    fill: cell.marked ? '#ffffff' : '#2c3e50'
                }).setOrigin(0.5);

                this.cardCells[col][row] = { bg: cellBg, text: cellText };
                this.container.add([cellBg, cellText]);

                // Cell interaction handler
                cellBg.on('pointerdown', () => this.onCellClick(col, row));
            }
        }

        // Add BINGO button at bottom center of card
        this.createBingoButton(cardSize);

        return this.container;
    }

    createBingoButton(cardSize) {
        const buttonY = cardSize * 0.35; // Lower center part of card
        const buttonWidth = cardSize * 0.4;
        const buttonHeight = cardSize * 0.12;

        // BINGO button background
        this.bingoButton = this.scene.add.rectangle(0, buttonY, 
            buttonWidth, buttonHeight, 0xe74c3c)
            .setInteractive({ useHandCursor: true });
        
        // BINGO button text
        this.bingoButtonText = this.scene.add.text(0, buttonY, 'BINGO!', {
            fontSize: Math.min(buttonWidth * 0.2, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add to container
        this.container.add([this.bingoButton, this.bingoButtonText]);

        // Button feedback animation
        this.bingoButton.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: [this.bingoButton, this.bingoButtonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
            });
        });

        // Button handler - check for win using WinChecker
        this.bingoButton.on('pointerdown', () => this.checkBingo());
    }

    checkBingo() {
        if (this.scene.winChecker) {
            this.scene.winChecker.checkForWin(this.card);
        }
    }

    onCellClick(col, row) {
        const cell = this.card[col][row];
        const displayCell = this.cardCells[col][row];

        if (!cell.marked && cell.number !== 'FREE' && 
            this.scene.numberManager && this.scene.numberManager.isNumberCalled(cell.number)) {
            cell.marked = true;
            
            // Create star image instead of changing color
            if (this.scene.textures.exists('star')) {
                const star = this.scene.add.image(displayCell.bg.x, displayCell.bg.y, 'star');
                star.setDisplaySize(displayCell.bg.width * 0.8, displayCell.bg.height * 0.8);
                this.container.add(star);
                
                // Store star reference for later cleanup
                displayCell.star = star;
            } else {
                // Fallback to color change if star image doesn't exist
                displayCell.bg.setFillStyle(0x27ae60);
                displayCell.text.setFill('#ffffff');
            }
            
            // Success animation
            this.scene.tweens.add({
                targets: displayCell.star || [displayCell.bg, displayCell.text],
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
            
            if (this.scene.winChecker) {
                this.scene.winChecker.checkForWin(this.card);
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.container) {
            this.container.setPosition(x, y);
        }
    }

    setVisible(visible) {
        if (this.container) {
            this.container.setVisible(visible);
        }
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }

    highlightNumber(number) {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                if (this.card[col][row].number === number && 
                    !this.card[col][row].marked) {
                    const cell = this.cardCells[col][row];
                    
                    this.scene.tweens.add({
                        targets: cell.bg,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 800,
                        yoyo: true,
                        repeat: 2,
                        ease: 'Sine.easeInOut'
                    });

                    this.scene.tweens.add({
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

    reset() {
        this.generate();
        this.updateDisplay();
    }

    updateDisplay() {
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                const cell = this.card[col][row];
                const displayCell = this.cardCells[col][row];
                
                displayCell.text.setText(cell.number);
                displayCell.bg.setFillStyle(cell.marked ? 0x27ae60 : 0xecf0f1);
                displayCell.text.setFill(cell.marked ? '#ffffff' : '#2c3e50');
                displayCell.bg.setAlpha(1);
                displayCell.bg.setScale(1);
            }
        }
    }
}

