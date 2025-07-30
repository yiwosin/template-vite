export class ScreeComponent {
    #width;
    #height;
    constructor() {
       this.#width=  Math.min(window.innerWidth, 450);
       this.#height = Math.min(window.innerHeight, 800);

    }

    width() {
        return this.#width;
    }

    height()   {
        return this.#height
    }
}