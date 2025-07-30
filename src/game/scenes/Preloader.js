import { Scene } from 'phaser';
import { gameWidth, gameHeight } from '../config.js';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const x = gameWidth / 2;
        const y = gameHeight / 2;
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');
        this.add.image(x,  gameHeight * 0.25, 'logo')
            .setScale(Math.min(0.4, 0.4)) // Scale logo to fit within the game width
            .setOrigin(0.5);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(x, y, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(x-230, y, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        // Load font
        this.load.font('raventure', 'assets/fonts/Raventure.otf');
        
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('button-bg', 'button.png');
        this.load.image('home', 'home.png');
        this.load.image('setting', 'setting.png');
        this.load.image('ball_b', 'balls/ball_B.png');
        this.load.image('ball_i', 'balls/ball_I.png');
        this.load.image('ball_n', 'balls/ball_N.png');
        this.load.image('ball_g', 'balls/ball_G.png');
        this.load.image('ball_o', 'balls/ball_O.png');
        this.load.image('bingo-card', 'bingo-card.png');
        this.load.image('bingo', 'bingo.png');
        this.load.image('bingo_bg', 'bingo-bg.png');
        this.load.image('rolling_area', 'rolling-area.png');
        this.load.image('number_popup', 'number-popup.png')
        this.load.image('star', 'star.png'); // Add star image
         // Debug: Listen for file load events
        // this.load.on('filecomplete', (key, type, data) => {
        //     console.log(`✅ Loaded: ${type} - ${key}`);
        // });

        // this.load.on('loaderror', (file) => {
        //     console.error(`❌ Failed to load: ${file.type} - ${file.key} from ${file.url}`);
        // });

        // this.load.on('complete', () => {
        //     console.log('🎯 All assets loaded');
            
        //     // Check if specific images exist in cache
        //     console.log('Logo exists:', this.textures.exists('logo'));
        //     console.log('Play-button exists:', this.textures.exists('play-button'));
        // });
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
