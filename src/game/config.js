// config.js - Game Configuration Settings

// === DISPLAY SETTINGS ===
export const gameWidth = Math.min(window.innerWidth, 450);
export const gameHeight = Math.min(window.innerHeight, 800);

// === GAME MECHANICS ===
export const GAME_CONFIG = {
    // Number calling timing
    NUMBER_ROLL_MIN_DELAY: 3000,    // Minimum delay between numbers (ms)
    NUMBER_ROLL_MAX_DELAY: 5000,    // Maximum delay between numbers (ms)
    
    // Animation settings
    ROLL_IN_DURATION: 1000,         // Time for number to roll in
    ROLL_OUT_DURATION: 1000,        // Time for number to roll out
    CENTER_PAUSE_DURATION: 1500,    // Time number stays in center
    
    // Bingo card settings
    CARD_SIZE_RATIO: 0.85,          // Card size as ratio of screen width
    CELL_SIZE_RATIO: 0.9,           // Cell size as ratio of available space
    FREE_SPACE_COL: 2,              // Column index for FREE space
    FREE_SPACE_ROW: 2,              // Row index for FREE space
    
    // Touch/click feedback
    CELL_ANIMATION_DURATION: 200,
    BUTTON_PRESS_SCALE: 0.95,
    BUTTON_ANIMATION_DURATION: 100,
    
    // Win celebration
    FIREWORKS_COUNT: 20,
    FIREWORK_DURATION: 2000,
    FIREWORK_DELAY_INCREMENT: 100,
};

// === BINGO RANGES ===
export const BINGO_RANGES = [
    [1, 15],   // B column
    [16, 30],  // I column  
    [31, 45],  // N column
    [46, 60],  // G column
    [61, 75]   // O column
];

export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

// === COLOR SCHEME ===
export const COLORS = {
    // Background colors
    BACKGROUND_PRIMARY: 0x2c3e50,
    BACKGROUND_SECONDARY: 0x34495e,
    HEADER_BACKGROUND: 0x34495e,
    
    // Text colors
    TITLE_COLOR: '#e74c3c',
    TITLE_STROKE: '#c0392b',
    PRIMARY_TEXT: '#ecf0f1',
    SECONDARY_TEXT: '#bdc3c7',
    DARK_TEXT: '#2c3e50',
    
    // Button colors  
    PRIMARY_BUTTON: 0xe74c3c,
    PRIMARY_BUTTON_HOVER: 0xc0392b,
    SECONDARY_BUTTON: 0x95a5a6,
    PAUSE_BUTTON: 0xf39c12,
    RESUME_BUTTON: 0x27ae60,
    NEW_GAME_BUTTON: 0xe67e22,
    CALL_BUTTON: 0x3498db,
    
    // Card colors
    CARD_HEADER: 0xe74c3c,
    CARD_CELL_DEFAULT: 0xecf0f1,
    CARD_CELL_MARKED: 0x27ae60,
    CARD_CELL_MARKED_TEXT: '#ffffff',
    
    // Letter-specific colors for rolling numbers
    LETTER_B: 0x3498db,  // Blue
    LETTER_I: 0x9b59b6,  // Purple  
    LETTER_N: 0xe74c3c,  // Red
    LETTER_G: 0x27ae60,  // Green
    LETTER_O: 0xf39c12,  // Orange
    
    // Effects
    WIN_OVERLAY: 0x000000,
    WIN_OVERLAY_ALPHA: 0.8,
    ROLLING_AREA_BACKGROUND: 0x34495e,
    ROLLING_AREA_ALPHA: 0.5,
    ROLLING_AREA_STROKE: 0x7f8c8d,
};

// === RESPONSIVE DESIGN ===
export const RESPONSIVE = {
    // Font size calculations (as ratio of screen width)
    TITLE_FONT_RATIO: 0.18,
    TITLE_FONT_MAX: 64,
    
    SUBTITLE_FONT_RATIO: 0.055,
    SUBTITLE_FONT_MAX: 22,
    
    BUTTON_FONT_RATIO: 0.08,
    BUTTON_FONT_MAX: 28,
    
    HEADER_FONT_RATIO: 0.08,
    HEADER_FONT_MAX: 28,
    
    INSTRUCTION_FONT_RATIO: 0.045,
    INSTRUCTION_FONT_MAX: 18,
    
    SMALL_TEXT_RATIO: 0.03,
    SMALL_TEXT_MAX: 12,
    
    // Button dimensions (as ratio of screen dimensions)
    MENU_BUTTON_WIDTH_RATIO: 0.6,
    MENU_BUTTON_HEIGHT_RATIO: 0.08,
    
    GAME_BUTTON_WIDTH_RATIO: 0.35,
    GAME_BUTTON_HEIGHT_RATIO: 0.06,
    
    BACK_BUTTON_WIDTH_RATIO: 0.2,
    
    // Layout ratios
    HEADER_HEIGHT_RATIO: 0.12,
    ROLLING_AREA_WIDTH_RATIO: 0.8,
    ROLLING_AREA_HEIGHT_RATIO: 0.15,
    
    // Rolling number sizing
    ROLLING_NUMBER_RADIUS_RATIO: 0.08,
    ROLLING_NUMBER_LETTER_RATIO: 0.04,
    ROLLING_NUMBER_NUMBER_RATIO: 0.06,
};

// === LAYOUT POSITIONS ===
export const LAYOUT = {
    // Menu scene positions (as ratio of screen height)
    MENU_TITLE_Y: 0.25,
    MENU_SUBTITLE_Y: 0.35,
    MENU_BUTTON_Y: 0.5,
    MENU_INSTRUCTIONS_Y: 0.7,
    
    // Game scene positions
    HEADER_RATIO: 0.35,
    BACK_BUTTON_X_RATIO: 0.15,
    
    ROLLING_AREA_Y_OFFSET: 0.08,
    ROLLING_AREA_LABEL_OFFSET: 0.4,
    ROLLING_AREA_HISTORY_OFFSET: 0.7,
    
    BINGO_CARD_Y: 0.5,
    CARD_HEADER_OFFSET: 0.4,
    
    CONTROLS_Y: 0.85,
    CONTROL_BUTTON_POSITIONS: [0.3, 0.7],
    
    INSTRUCTIONS_Y: 0.92,
    
    // Win screen positions
    WIN_TITLE_Y: 0.4,
    WIN_MESSAGE_Y: 0.5,
    WIN_INSTRUCTION_Y: 0.6,
};

// === PHASER CONFIGURATION ===
export const PHASER_CONFIG = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// === UTILITY FUNCTIONS ===
export const UTILS = {
    // Calculate responsive font size
    getResponsiveFontSize: (ratio, maxSize) => {
        return Math.min(gameWidth * ratio, maxSize) + 'px';
    },
    
    // Calculate position based on screen dimensions
    getPositionX: (ratio) => gameWidth * ratio,
    getPositionY: (ratio) => gameHeight * ratio,
    
    // Get center coordinates
    getCenterX: () => gameWidth / 2,
    getCenterY: () => gameHeight / 2,
    
    // Get letter color for rolling numbers
    getLetterColor: (letter) => {
        const colorMap = {
            'B': COLORS.LETTER_B,
            'I': COLORS.LETTER_I, 
            'N': COLORS.LETTER_N,
            'G': COLORS.LETTER_G,
            'O': COLORS.LETTER_O
        };
        return colorMap[letter] || COLORS.LETTER_N;
    },
    
    // Get letter from number
    getNumberLetter: (number) => {
        if (number <= 15) return 'B';
        if (number <= 30) return 'I';
        if (number <= 45) return 'N';
        if (number <= 60) return 'G';
        return 'O';
    },
    
    // Generate random delay for number rolling
    getRandomDelay: () => {
        return Phaser.Math.Between(
            GAME_CONFIG.NUMBER_ROLL_MIN_DELAY,
            GAME_CONFIG.NUMBER_ROLL_MAX_DELAY
        );
    }
};

// === DEVELOPMENT SETTINGS ===
export const DEV_CONFIG = {
    DEBUG_MODE: false,
    SHOW_FPS: false,
    LOG_GAME_EVENTS: false,
    FAST_NUMBERS: false,  // Set to true for faster testing
    AUTO_MARK_NUMBERS: false,  // Set to true to auto-mark called numbers
};

// Override timing for development/testing
if (DEV_CONFIG.FAST_NUMBERS) {
    GAME_CONFIG.NUMBER_ROLL_MIN_DELAY = 500;
    GAME_CONFIG.NUMBER_ROLL_MAX_DELAY = 1000;
}

// === EXPORTS FOR BACKWARDS COMPATIBILITY ===
export default {
    gameWidth,
    gameHeight,
    GAME_CONFIG,
    BINGO_RANGES,
    BINGO_LETTERS,
    COLORS,
    RESPONSIVE,
    LAYOUT,
    PHASER_CONFIG,
    UTILS,
    DEV_CONFIG
};