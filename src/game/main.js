import { Boot } from './scenes/Boot';
import { GameScene } from './scenes/GameScene';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Lobby } from './scenes/Lobby';
import { Preloader } from './scenes/Preloader';
import { AUTO, CANVAS, Game } from 'phaser';

// Mobile-optimized dimensions
    const gameWidth = Math.min(window.innerWidth, 450);
    const gameHeight = Math.min(window.innerHeight, 800);

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Lobby,
        GameScene,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
