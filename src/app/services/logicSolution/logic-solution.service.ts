import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicSolutionService {


  OPERATORS = "+×-÷";
  OPERATORS2 = this.OPERATORS + "<>";
  LETTERS = "QWERTYUIOPASDFGHJKLZCVBNM";


  constructor() { }



    /***************************
 * 
 * 
 * 
 * 
*
*  GAME INIT
*
* 
* 
* 
***************************/

  generateNewGame(dimension: number): Map<string,any> {
    let randomLetters = this.pickUnique(this.LETTERS, dimension);
    let randomNumbers = []
    for (let i = 1; i <= dimension; i++) {
      randomNumbers.push(i);
    }

    let solution = [];
    for (let i = 0; i < dimension; i++) {
      solution.push(randomLetters[i] + "." + randomNumbers[i]);
    }

    let result = new Map<string,any>();
    result.set("letters", randomLetters);
    result.set("numbers", randomNumbers);
    result.set("solution", solution)

    return result;
  }

  getRandom(array: string[]): number {
    // returns a random number between 0 and the length of array 
    // MAYBE ERROR: warning Math.random() should never return 1! Otherwise we are going to select the n-th element of the array
    return Math.floor(Math.random() * array.length);
  }

  pickUnique(charset: string, quantity: number): string[] {
    // given 
    // charset = "QWERTYUIOPASDFGHJKLZCVBNM" 
    // quantity = 10
    // returns 10 random letters from LETTERS ---> ["B", "D", "E", ..., "M"]

    const copy = [...charset];
    const r = [];
    while (quantity--) {
      const rnd = this.getRandom(copy);
      r.push(copy.splice(rnd, 1)[0]);
    }
    return r;
  }

  coinFlip(): boolean {
    // returns true or false with uniform distribution (1/2)
    return Math.random() > 0.5;
  }


  getClue(letterNumber): string {
    // Reverse map for lookup by number
    const numberLetter = Object.entries(letterNumber).reduce(
        (a, b) => ((a[b[1]] = b[0]), a),
        {}
    );

    const [a, b] = this.pickUnique(Object.keys(letterNumber), 2);
    const [v1, v2] = [letterNumber[a], letterNumber[b]];

    // Relational way
    if (this.coinFlip()) {
        const operator = this.pickUnique(this.OPERATORS, 1)[0];

        if (operator === "+") {
            const c = numberLetter[v1 + v2];
            if (!c || [a, b].includes(c)) return this.getClue(letterNumber);
            else return `${a} + ${b} = ${c}`;
        }

        if (operator === "-") {
            const c = numberLetter[v1 - v2];
            if (!c || [a, b].includes(c)) return this.getClue(letterNumber);
            else return `${a} - ${b} = ${c}`;
        }

        if (operator === "×") {
            const c = numberLetter[v1 * v2];
            if (!c || [a, b].includes(c)) return this.getClue(letterNumber);
            else return `${a} × ${b} = ${c}`;
        }

        if (operator === "÷") {
            const c = numberLetter[v1 / v2];
            if (!c || [a, b].includes(c)) return this.getClue(letterNumber);
            else return `${a} ÷ ${b} = ${c}`;
        }
    }

    const operator = this.pickUnique(this.OPERATORS2, 1)[0];

    if (operator === "<")
        if (v1 < v2) return `${a} < ${b}`;
        else return `${b} < ${a}`;

    if (operator === ">")
        if (v1 > v2) return `${a} > ${b}`;
        else return `${b} > ${a}`;

    if (operator === "+") return `${a} + ${b} = ${v1 + v2}`;

    if (operator === "-") return `${a} - ${b} = ${v1 - v2}`;

    if (operator === "×") return `${a} × ${b} = ${v1 * v2}`;

    if (operator === "÷")
        if (a === 1 || b === 1 || (v1 / v2) % 1 !== 0) return this.getClue(letterNumber);
        else return `${a} ÷ ${b} = ${v1 / v2}`;
  }

}
