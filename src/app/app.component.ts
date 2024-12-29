import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getGame, IGame } from './logi-number.utils';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'logi-number';

    letterNumberMap!: Record<string, number>;
    letters!: string[];
    numbers!: number[];
    equations!: string[];
    size = "4";

    matrix: Record<string, number> = {};

    constructor() {
        (window as any).initGame = this.init.bind(this);
        this.init();
    }

    init(n?: number, g?: IGame) {
        n = n || Number(this.size);
        const game = g || getGame(n);
        this.letterNumberMap = game.letterNumberMap;
        this.letters = Object.keys(game.letterNumberMap).sort((a, b) => a.localeCompare(b));
        this.numbers = Object.values(game.letterNumberMap).sort((a, b) => a - b);
        this.equations = game.operations;
        this.matrix = {};
        console.log(game);
    }

    rotateCellState(l: string, n: number) {
        let someAlreadyGreen = false;
        for (let l of this.letters) {
            if (this.matrix[`${l}:${n}`] === 1) {
                someAlreadyGreen = true;
            }
        }
        for (let n of this.numbers) {
            if (this.matrix[`${l}:${n}`] === 1) {
                someAlreadyGreen = true;
            }
        }
        if (someAlreadyGreen) {
            this.matrix[`${l}:${n}`] = this.matrix[`${l}:${n}`] === 2 ? 0 : 2;
            return;
        }
        this.matrix[`${l}:${n}`] = this.matrix[`${l}:${n}`] || 0;
        this.matrix[`${l}:${n}`] = (this.matrix[`${l}:${n}`] + 1) % 3;
    }

    clearAllCol(n: number) {
        let countRed = 0;
        let countWhite = 0;
        for (let l of this.letters) {
            if (this.matrix[`${l}:${n}`] === 0) {
                countWhite++;
            } else if (this.matrix[`${l}:${n}`] === 2) {
                countRed++;
            }
        }
        for (let l of this.letters) {
            if (this.matrix[`${l}:${n}`] === 1) {
                continue;
            }
            this.matrix[`${l}:${n}`] = countRed >= countWhite ? 0 : 2;
        }
    }

    clearAllRow(l: string) {
        let countRed = 0;
        let countWhite = 0;
        for (let n of this.numbers) {
            if (this.matrix[`${l}:${n}`] === 0) {
                countWhite++;
            } else if (this.matrix[`${l}:${n}`] === 2) {
                countRed++;
            }
        }
        for (let n of this.numbers) {
            if (this.matrix[`${l}:${n}`] === 1) {
                continue;
            }
            this.matrix[`${l}:${n}`] = countRed >= countWhite ? 0 : 2;
        }
    }

    reset() {
        for (let l of this.letters) {
            for (let n of this.numbers) {
                this.matrix[`${l}:${n}`] = 0;
            }
        }
    }

    check() {
        const greenTiles: Record<string, number> = {};
        for (let l of this.letters) {
            for (let n of this.numbers) {
                if (this.matrix[`${l}:${n}`] === 1) {
                    greenTiles[l] = n;
                }
            }
        }
        if (Object.keys(greenTiles).length !== this.letters.length) {
            return false;
        }
        for (let letter in greenTiles) {
            if (this.letterNumberMap[letter] !== greenTiles[letter]) {
                return false;
            }
        }
        return true;
    }

    alert(msg: string) {
        alert(msg);
    }
}
