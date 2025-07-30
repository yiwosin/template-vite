import { gameWidth, gameHeight } from '../config.js';
// Bingo Card Component Class

export class BingoCard {

    constructor(scene) {
        this.scene = scene;
        this.card = [];
        this.cardCells = [];
        this.ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
        this.letters = ['B', 'I', 'N', 'G', 'O'];
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

    createDisplay() {

        const cardSize = Math.min(gameWidth * 0.85, gameHeight * 0.4);
        const cellSize = cardSize / 5;
        const startX = (gameWidth - cardSize) / 2 + cellSize / 2;
        const startY = gameHeight * 0.5;
        // const container = this.scene.add.container(0, 0);

        const letterColors = [0x9b59b6, 0x3498db, 0x27ae60,  0xf39c12,  0xe74c3c]
        // Draw column headers
        for (let col = 0; col < 5; col++) {

            const x = startX + col * cellSize;
            // console.log(letterColors[col+1])
            this.scene.add.rectangle(x, startY - cellSize * 2.5, cellSize * 0.9, cellSize * 0.3, letterColors[col]);
            this.scene.add.text(x, startY - cellSize * 2.5, this.letters[col], {
                fontSize: Math.min(cellSize * 0.4, 20) + 'px',
                fontFamily: 'Arial Black',
                fill: '#ffffffff'
            }).setOrigin(0.5);

        }

        // Draw bingo card cells
        this.cardCells = [];
        for (let col = 0; col < 5; col++) {
            this.cardCells[col] = [];
            
            for (let row = 0; row < 5; row++) {
                const x = startX + col * cellSize;
                const y = startY + row * cellSize;
                const cell = this.card[col][row];
                
                const cellBg = this.scene.add.rectangle(x, y, cellSize * 0.9, cellSize * 0.9, 
                    cell.marked ? 0x27ae60 : 0xecf0f1)
                    .setInteractive({ useHandCursor: true });          
                const fontSize = cell.number === 'FREE' ? cellSize * 0.2 : cellSize * 0.35;
                const cellText = this.scene.add.text(x, y, cell.number, {
                    fontSize: Math.min(fontSize, 18) + 'px',
                    fontFamily: 'Arial Black',
                    fill: cell.marked ? '#ffffff' : '#2c3e50'
                }).setOrigin(0.5);

                this.cardCells[col][row] = { bg: cellBg, text: cellText };

                // Cell interaction handler
                cellBg.on('pointerdown', () => this.onCellClick(col, row));
            }
        }

        // container.add([bg, numberText]);
        // // Start position (off screen)
        // container.setPosition(this.rollingArea.x + this.rollingArea.width * 0.04
        //     , this.rollingArea.y + this.rollingArea.height * 0.5); 
    }

    onCellClick(col, row) {
        const cell = this.card[col][row];
        const displayCell = this.cardCells[col][row];

        if (!cell.marked && cell.number !== 'FREE' && 
            this.scene.numberManager.isNumberCalled(cell.number)) {
            cell.marked = true;
            displayCell.bg.setFillStyle(0x27ae60);
            displayCell.text.setFill('#ffffff');
            
            // Success animation
            this.scene.tweens.add({
                targets: [displayCell.bg, displayCell.text],
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
            
            this.scene.winChecker.checkForWin(this.card);
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
