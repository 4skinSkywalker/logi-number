import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicSolutionService {


  OPERATORS = "+×-÷";
  OPERATORS2 = this.OPERATORS + "<>";
  LETTERS = "QWERTYUIOPASDFGHJKLZCVBNM";


  // Info: 
  // clues = ['A+B=6', 'B<C', 'CxD=7', ...]
  // letterNumber = { 'A': 2, 'B': 1, ...}
  // numberLetter = { 2: 'A', 1: 'B', ...}


  
  // letterNumber = {
  //     "Q": 0,
  //     "W": 1,
  //     "E": 2,...
  //     "M": 25
  // }
  
  // public type StringNumberDictionary = {
  //   [key: string]: number;
  // };



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

  getRandom(array: string[] | number[]): number {
    // returns a random number between 0 and the length of array 
    // MAYBE ERROR: warning Math.random() should never return 1! Otherwise we are going to select the n-th element of the array
    return Math.floor(Math.random() * array.length);
  }

  pickUnique(charset: string | any[], quantity: number): string[] {
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


  getClue(letterNumber: { [key: string]: number}): string {

    // Reverse map for lookup by number
    const numberLetter = Object.entries(letterNumber).reduce(
        (a: {[key: number]: string}, b) => ((a[b[1]] = b[0]), a),
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
        // Maybe ERROR? Here a and b should not be letters??? 
        // if (a === 1 || b === 1 || (v1 / v2) % 1 !== 0) return this.getClue(letterNumber);
        if (v1 === 1 || v2 === 1 || (v1 / v2) % 1 !== 0) return this.getClue(letterNumber);
        else return `${a} ÷ ${b} = ${v1 / v2}`;
    

    return 'I am just a string that is never going to be returned, but avoids typescript to complain!'
  }


  // elementValue = {
  // 0: 0,
  // 1: 1,
  // .. }
  nextPermutation(elements: number[], elementValue: {[key: number]: number}): number[] | false {
    // Find longest non-increasing suffix
    let i = elements.length - 1;
    while (elementValue[elements[i]] <= elementValue[elements[i - 1]]) i--;

    if (i === 0) return false;

    const pivot = i - 1;

    // Find smallest rightmost number that's bigger than pivot
    let j = elements.length - 1;
    while (elementValue[elements[j]] < elementValue[elements[pivot]]) j--;

    // Swap
    [elements[pivot], elements[j]] = [elements[j], elements[pivot]];

    // Reverse suffix
    let k = i;
    let m = elements.length - 1;
    while (k < m) {
        [elements[k], elements[m]] = [elements[m], elements[k]];
        k++;
        m--;
    }

    return elements;
  }


  generateAllPermutations(elements: number[], elementValue: {[key: number]: number}) {
    const permutations = [[...elements]];
    let permutation = this.nextPermutation(elements, elementValue);
    while (permutation) {
        permutations.push([...permutation]);
        permutation = this.nextPermutation(elements, elementValue);
    }
    return permutations;
  }

  checkLogiNumber(logiNumber: {clues: string[]; letterNumber: {[key: string]: number}}) {
    // Unpack logiNumber
    const { clues, letterNumber } = logiNumber;

    const letters = Object.keys(letterNumber);
    const side = letters.length;

    // Get permutations of letterNumber
    const numbers = Array(side)
        .fill(0)
        .map((_, i) => ++i);
    const permutations = this.generateAllPermutations(
        numbers,
        numbers.reduce((a: {[key: number]: number}, b) => ((a[b] = b), a), {})
    );
    const letterNumberList = permutations.map((p) =>
        p.reduce((a: {[key: string]: number}, b, i) => ((a[letters[i]] = b), a), {})
    );

    // Adjust expression for evaluation
    const expressions = clues.map((c: string) =>
        c.replace("×", "*").replace("÷", "/").replace("=", "===")
    );

    // Get validity for each permutation
    const validityList = letterNumberList.map((letterNumber) =>
        expressions
            .map((expression: string) => {
                Object.entries(letterNumber).forEach(
                    ([letter, number]) =>
                        (expression = expression.replaceAll(letter, number.toString()))
                );
                return expression;
            })
            .every((expression: string) => eval(expression))
    );

    // Return valid if no more than 1 solution was found
    return validityList.filter((validity) => validity).length < 2;
  }



  getLogiNumber(side: number): { clues: string[]; letterNumber: {[key: string]: number}} {
      const numbers = this.pickUnique(
          Array(side)
              .fill(0)
              .map((_, i) => ++i),
          side
      );
      const letters = this.pickUnique(this.LETTERS, side);
      const letterNumber = letters.reduce(
          (a: {[key: string]: any}, b: string, i) => ((a[b] = numbers[i]), a),
          {}
      );

      const clues = [];
      for (let i = 0; i < side - 1; i++) {
          clues.push(this.getClue(letterNumber));
      }

      if (!this.checkLogiNumber({ clues, letterNumber })) return this.getLogiNumber(side);

      return { clues, letterNumber };
  }

  startGame(size: number): {"solution": string[], "clues": string[], "letters": string[], "numbers": number[]} {
    // solutions: ["A.1", "B.2", "C.3"]
    const logiNumber = this.getLogiNumber(size);

    let solution = [];
    let letters = [];
    let numbers = [];

    for(let key of Object.keys(logiNumber.letterNumber)) {
      let value = logiNumber.letterNumber[key]
      letters.push(key);
      solution.push(key + "." + value);
    }

    for(let i = 1; i<=solution.length; i++) {
      numbers.push(i);
    }

    return {
      "solution": solution,
      "clues": logiNumber.clues,
      "letters": letters,
      "numbers": numbers
    }
  }




}
