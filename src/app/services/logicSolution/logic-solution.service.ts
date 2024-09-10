import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicSolutionService {

  // const --> Later to put in logic! 
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

}
