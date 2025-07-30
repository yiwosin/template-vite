# Bingo Game Architecture Guide

## Overview

This document explains the refactored architecture of the mobile Bingo game, breaking down how the code is organized into separate, reusable classes following object-oriented design principles.

## Architecture Pattern

The game follows a **Component-Based Architecture** where each major game feature is encapsulated in its own class. The `GameScene` acts as a coordinator that initializes and manages these components.

```javascript
class GameScene extends Phaser.Scene {
    create() {
        // Initialize all components
        this.bingoCard = new BingoCard(this);
        this.numberManager = new NumberManager(this);
        this.winChecker = new WinChecker(this);
        this.uiController = new UIController(this);
        this.gameState = new GameStateManager(this);
        
        this.setupGame();
        this.gameState.startGame();
    }
}
```

## Class Breakdown

### 1. BingoCard Class

**Purpose**: Manages the bingo card generation, display, and user interactions.

**Key Responsibilities**:
- Generate random bingo cards following BINGO rules
- Create visual representation of the card
- Handle cell click interactions
- Provide visual feedback for called numbers

**Code Example - Card Generation**:
```javascript
generate() {
    this.card = [];
    
    for (let col = 0; col < 5; col++) {
        const column = [];
        const [min, max] = this.ranges[col]; // B(1-15), I(16-30), etc.
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
```

**Code Example - Cell Interaction**:
```javascript
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
            scaleX: 1.2, scaleY: 1.2,
            duration: 200, yoyo: true,
            ease: 'Back.easeOut'
        });
        
        this.scene.winChecker.checkForWin(this.card);
    }
}
```

### 2. NumberManager Class

**Purpose**: Handles the automatic number calling system with rolling animations.

**Key Responsibilities**:
- Manage the pool of available numbers
- Create rolling number animations
- Control timing between number calls
- Track called number history

**Code Example - Number Rolling System**:
```javascript
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

    // Schedule next number with random timing
    this.timer = this.scene.time.delayedCall(
        Phaser.Math.Between(3000, 5000),
        this.rollNextNumber, [], this
    );
}
```

**Code Example - Rolling Animation**:
```javascript
createRollingNumber(number) {
    const letter = this.getNumberLetter(number);
    const container = this.scene.add.container(0, 0);
    
    const bg = this.scene.add.circle(0, 0, gameWidth * 0.08, this.letterColors[letter]);
    const letterText = this.scene.add.text(-5, -15, letter, {
        fontSize: Math.min(gameWidth * 0.04, 16) + 'px',
        fontFamily: 'Arial Black',
        fill: '#ffffff'
    }).setOrigin(0.5);

    const numberText = this.scene.add.text(0, 8, number, {
        fontSize: Math.min(gameWidth * 0.06, 24) + 'px',
        fontFamily: 'Arial Black',
        fill: '#ffffff'
    }).setOrigin(0.5);

    container.add([bg, letterText, numberText]);
    container.setPosition(-gameWidth * 0.1, this.rollingArea.y);

    this.animateRollingNumber(container);
    this.rollingNumbers.push({ container, number, letter });
}
```

### 3. WinChecker Class

**Purpose**: Detects winning conditions and manages victory celebrations.

**Key Responsibilities**:
- Check for winning patterns (rows, columns, diagonals)
- Trigger win animations and effects
- Display victory messages

**Code Example - Win Detection Logic**:
```javascript
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
```

**Code Example - Victory Animation**:
```javascript
createFireworks() {
    for (let i = 0; i < 20; i++) {
        const particle = this.scene.add.circle(
            Phaser.Math.Between(50, gameWidth - 50),
            Phaser.Math.Between(100, gameHeight - 100),
            5, Phaser.Math.Between(0x000000, 0xffffff)
        );
        
        this.scene.tweens.add({
            targets: particle,
            scaleX: 3, scaleY: 3, alpha: 0,
            duration: 2000, delay: i * 100
        });
    }
}
```

### 4. UIController Class

**Purpose**: Manages all user interface elements and interactions.

**Key Responsibilities**:
- Create and position UI elements
- Handle button interactions and feedback
- Update dynamic UI states

**Code Example - Control Creation**:
```javascript
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

    // Button feedback animation
    this.pauseButton.on('pointerdown', () => {
        this.scene.tweens.add({
            targets: this.pauseButton,
            scaleX: 0.95, scaleY: 0.95,
            duration: 100, yoyo: true
        });
    });

    // Connect to game logic
    this.pauseButton.on('pointerdown', () => this.scene.toggleGame());
}
```

### 5. GameStateManager Class

**Purpose**: Manages overall game state and coordinates between components.

**Key Responsibilities**:
- Track game status (active, paused, won)
- Coordinate component interactions
- Handle game flow (start, pause, reset)

**Code Example - State Management**:
```javascript
class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.isGameActive = false;
        this.isGameWon = false;
        this.isPaused = false;
    }

    startGame() {
        this.isGameActive = true;
        this.isGameWon = false;
        this.isPaused = false;
        this.scene.numberManager.start();
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    winGame(winType) {
        this.isGameWon = true;
        this.isGameActive = false;
        this.scene.numberManager.stop();
        this.scene.winChecker.showWinAnimation(winType);
    }
}
```

## Component Communication

The classes communicate through the scene reference and direct method calls:

```javascript
// BingoCard notifies WinChecker when a cell is marked
this.scene.winChecker.checkForWin(this.card);

// NumberManager checks if a number was called
this.scene.numberManager.isNumberCalled(cell.number)

// GameStateManager coordinates multiple components
winGame(winType) {
    this.isGameWon = true;
    this.isGameActive = false;
    this.scene.numberManager.stop();           // Stop number rolling
    this.scene.winChecker.showWinAnimation(winType); // Show celebration
}
```

## Data Flow

1. **Game Start**: `GameStateManager` → `NumberManager.start()`
2. **Number Called**: `NumberManager` → `BingoCard.highlightNumber()`
3. **Cell Clicked**: `BingoCard` → `WinChecker.checkForWin()`
4. **Win Detected**: `WinChecker` → `GameStateManager.winGame()`
5. **UI Updates**: `GameStateManager` → `UIController.updatePauseButton()`

## Benefits of This Architecture

### **Separation of Concerns**
Each class has a single, well-defined responsibility:
```javascript
// BingoCard only handles card logic
this.bingoCard.generate();
this.bingoCard.createDisplay();

// NumberManager only handles number calling
this.numberManager.start();
this.numberManager.rollNextNumber();

// WinChecker only handles win detection
this.winChecker.checkForWin(card);
```

### **Reusability**
Components can be easily reused or replaced:
```javascript
// Easy to swap out different win checkers
this.winChecker = new AdvancedWinChecker(this); // Different win patterns
this.winChecker = new SimpleWinChecker(this);   // Basic patterns only
```

### **Testability**
Each component can be tested independently:
```javascript
// Test bingo card generation
const card = new BingoCard(mockScene);
card.generate();
assert(card.card[2][2].number === 'FREE');

// Test win detection
const winChecker = new WinChecker(mockScene);
const result = winChecker.detectWin(mockWinningCard);
assert(result === 'Row 1');
```

### **Maintainability**
Changes are localized to specific components:
```javascript
// Want to change number rolling speed? Only modify NumberManager
rollNextNumber() {
    // Change this line to adjust timing
    this.timer = this.scene.time.delayedCall(1000, ...); // Faster rolling
}

// Want different win celebrations? Only modify WinChecker
showWinAnimation(winType) {
    // Add new animation types here
    this.createConfetti();
    this.playVictorySound();
}
```

## Mobile Optimization

The architecture supports mobile-specific features through responsive design:

```javascript
// Dynamic sizing based on screen dimensions
const gameWidth = Math.min(window.innerWidth, 450);
const gameHeight = Math.min(window.innerHeight, 800);

// Touch-optimized button sizes
const buttonWidth = gameWidth * 0.35;
const buttonHeight = gameHeight * 0.06;

// Mobile-friendly cell sizing
const cellSize = cardSize / 5;
const cellBg = this.scene.add.rectangle(x, y, cellSize * 0.9, cellSize * 0.9)
    .setInteractive({ useHandCursor: true });
```

This architecture makes the codebase modular, maintainable, and easily extensible for future features like multiplayer support, different game modes, or enhanced animations.