// CHECK 1.deposit some money
// CHECK 2.how many lines they wanna bet
// CHECK 3.collect a bet amount
// CHECK 4.create "slot machine"
// CHECK 5.roll the slot machine
// CHECK 6.check if the user won
// CHECK 7.give the user their prize
// CHECK 8.play again


// prompt that allows us to get input from a "user"
const prompt = require("prompt-sync")();

// slot machine set-up
const ROWS = 3;
const COLS = 3;

// how many of each symbol we have
const symbolsCount = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

// how much value is each symbol
const symbolsValues = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposit = () =>{
    while(true){ // repeats the loop while the user inserst the wrong amount
        const depositAmount = prompt('Enter a deposit amount: ');
        const numberDepositAmount = parseFloat(depositAmount); // turns the string we got from the input into a number

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log('Invalid amount of money, try again.');
        } else {
            return numberDepositAmount;
        }
    }
};

const getLines = () => {
    while(true){
        const lines = prompt('Enter how many lines you want to bet on (between 1 to 3): ');
        const numberLines = parseFloat(lines);

        if (isNaN(numberLines) || numberLines <= 0 || numberLines >= 3){
            console.log('Invalid amount of lines, try again.');
        } else {
            return numberLines;
        }
    }
    //console.log(lines);
};

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt('Enter the bet per line: ');
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log('Invalid bet, check your balance again.');
        } else {
            return numberBet;
        }
    }
    //console.log(bet);
};

const spinReels = () => {
    //this is the array that display all the possible symbols that we previously defined in an object
    const symbols = [];
    for (const [symbol, count] of Object.entries(symbolsCount)){     //sees how many symbols there are in the object
        for (let i=0; i<count; i++){                                 //sees how many times each symbol appears
            symbols.push(symbol)                                     //updates the previous empty array with all the results
        }
    }
    //console.log(symbols)
    //the result displayed should be:
    //['A', 'A', 'B', 'B', 'B',
    //'B', 'C', 'C', 'C', 'C',
    //'C', 'C', 'D', 'D', 'D',
    //'D', 'D', 'D', 'D', 'D']

    //this is an array with 3 "arrays" inside - each one for 1 of the columns of the spinning wheel
    const reels = [];
    for (let i=0; i<COLS; i++){                                       //goes through each column 
        reels.push([]);                                               //adds a column   
        const reelSymbols = [...symbols];                             //pushes the amount of symbols from the array done before into each column
        for (let j=0; j<ROWS; j++){                                   //goes through each row
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);                            //pushes 1 symbol into a place
            reelSymbols.splice(randomIndex, 1);                       //removes the symbol that was already used (if there was 3xA, the other 2 will remain)
        }
    }
    return reels;
    //console.log(reels);
};
//console.log(reels)
//the result displayed should be:
//[ [ 'C', 'D', 'B' ], [ 'D', 'D', 'B' ], [ 'B', 'D', 'D' ] ]

const transpose = (reels) => {
    const rows = [];

    for (let i=0; i<ROWS; i++){
        rows.push([]);
        for (let j=0; j<COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
    //console.log(rows);
};

const printResult = (rows) => {
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length - 1){
                rowString += " | "
            }
        }
        //console.log(rowString)
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbol[0]){
                allSame = false;
                break;
            }
        }

        if (allSame){
            winnings += bet * symbolsValues[symbols[0]];
        }

    }
    return winnings
    //console.log(winnings);

};

const game = () => {
    let balance = deposit();

    while (true){
        console.log('Your balance is: ' + balance);

        const lines = getLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;

        const reels = spinReels();
        const rows = transpose(reels);
        printResult(rows);
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        console.log('You won ' + winnings.toString() + '€!!!')

        if(balance <= 0){
            console.log('You ran out of money :(');
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?")
        if(playAgain != "y" ) break;
    }
};

game();