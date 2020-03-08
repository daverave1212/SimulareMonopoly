
Board = []



function randomInt(low, high) { return Math.floor(Math.random() * (high - low)) + low }
function d6() { return randomInt(1, 7) }

class BoardTile {
    constructor (name, color) {
        this.name = name
        this.color = color
        this.index = Board.length
        this.owner = null
        this.isBuyable = ['white'].includes(this.color) ? false : true
        Board.push(this)
    }
}

new BoardTile('GO', 'white')
new BoardTile('Old Kent Road', 'brown')
new BoardTile('Community Chest', 'white')
new BoardTile('Whitechapel Road', 'brown')
new BoardTile('Income Tax', 'white')
new BoardTile('Kings Cross Station', 'black')
new BoardTile('The Angel, Islington', 'teal')
new BoardTile('Chance', 'white')
new BoardTile('Euston Road', 'teal')
new BoardTile('Pentounville Road', 'teal')
new BoardTile('Jail', 'white')
new BoardTile('Pall Mall', 'magenta')
new BoardTile('Electric Company', 'gold')
new BoardTile('Whitehall', 'magenta')
new BoardTile('Northumrl\'d Avenue', 'magenta')
new BoardTile('Marylebone Station', 'black')
new BoardTile('Bow Street', 'orange')
new BoardTile('Community Chest', 'white')
new BoardTile('Marlborough Street', 'orange')
new BoardTile('Vine Street', 'orange')
new BoardTile('Free Parking', 'white')
new BoardTile('Strand', 'red')
new BoardTile('Chance', 'white')
new BoardTile('Fleet Street', 'red')
new BoardTile('Trafalgar Square', 'red')
new BoardTile('Fenchurch ST. Station', 'black')
new BoardTile('Leicester Square', 'yellow')
new BoardTile('Coventry Street', 'yellow')
new BoardTile('Water WOrks', 'gold')
new BoardTile('Piccadilly', 'yellow')
new BoardTile('Go To Jail', 'white')
new BoardTile('Regent Street', 'green')
new BoardTile('Oxford Street', 'green')
new BoardTile('Community Chest', 'white')
new BoardTile('Bond Street', 'green')
new BoardTile('Liverpool ST. Station', 'black')
new BoardTile('Chance', 'white')
new BoardTile('Park Lane', 'blue')
new BoardTile('Super Tax', 'white')
new BoardTile('Mayfair', 'blue')



function getAllTilesWithColor(color) { return Board.filter(tile => tile.color == color) }

function allTilesWithColorAreOwnedByAPlayer(color) {
    let owner = getAllTilesWithColor(color).filter( tile => tile.owner != null )
    if (owner.length == 0) return null
    owner = owner[0]
    let nTotalTilesOfColor = getAllTilesWithColor(color).length
    let nTilesOfColorOwned = getAllTilesWithColor(color).filter( tile => tile.owner == owner ).length
    if (nTotalTilesOfColor == nTilesOfColorOwned) return owner
    else return null
}

function areAllTilesOwned() {
    let buyableTiles = Board.filter( tile => tile.isBuyable )
    let boughtTiles  = buyableTiles.filter( tile => tile.owner != null )
    if (buyableTiles.length == boughtTiles.length) return true
    else return false
}





Players = []

class Player {
    constructor(name) {
        this.name = name
        this.index = Players.length
        this.position = 0   // On board
        this.ownedTiles = []
        this.nTurnsTaken = 0
        Players.push(this)
    }

    takeTurn() {
        this.nTurnsTaken ++
        // console.log(`${this.name}'s turn:'`)
        let tilesToMove = d6() + d6()
        this.position += tilesToMove
        if(this.position >= Board.length){
            this.position -= Board.length
        }
        let thisTile = Board[this.position]
        //console.log(`Moves ${tilesToMove} and lands on ${thisTile.name}...`)
        if (thisTile.owner == null && thisTile.isBuyable)
            this.buyTile(thisTile)
        else if (thisTile.isBuyable){
            // console.log(`    Tile is already owned by ${thisTile.owner.name}!`)
        }
        else {
            // console.log(`    Nothing to do.`)
        }
        if (this.doIHaveMonopoly(thisTile)) {
            // alert(`${this.name} wins the game and owns all ${thisTile.color} tiles!`)
            return true
        } else {
            return false
        }
    }

    buyTile(tile) {
        //console.log(`    Buys tile ${tile.name}! (${tile.color})`)
        tile.owner = this
        this.ownedTiles.push(tile)
    }

    doIHaveMonopoly(tile) {
        let color = tile.color
        if (color == 'white') {
            //console.log('   Not ownable.')
            return false
        }
        let owner = getAllTilesWithColor(color).filter( tile => tile.owner != null )
        if (owner.length == 0) {
            //console.log('    Not owned at all')
            return false
        }
        owner = owner[0].owner
        if (owner != this) {
            //console.log(`    Owner ${owner.name} not the same as ${this.name}`)
        }
        let nTotalTilesOfColor = getAllTilesWithColor(color).length
        let nTilesOfColorOwned = getAllTilesWithColor(color).filter( tile => tile.owner == owner ).length
        if (nTotalTilesOfColor == nTilesOfColorOwned) return true
        else {
            //console.log(`    I just dont own all :(`)
            return false
        }
    }
}

new Player('David')
new Player('Ludovic')
// new Player('Archibald')
// new Player('Bob')

let Data = {
    rawData: [],
    winsByColor: {
        brown: 0, black: 0, teal: 0, magenta: 0, gold: 0, orange: 0, red: 0, yellow: 0, green: 0, blue: 0
    },
    nTotalWins: 0,
    nDraws: 0,
    nRuns: 0
}


function runTest(runNumber){
    while (true) {
        let winner = null
        for (let player of Players) {
            let didWin = player.takeTurn()
            if (didWin) {
                winner = player
                break
            }
        }
        if (areAllTilesOwned()) {
            //console.log('Draw!')
            /*Data.rawData.push({
                nPlayers: Players.length,
                winnerPlayerIndex: null,
                winnerColor: null
            })*/
            Data.nDraws ++
            Data.nRuns ++
            break
        }
        if (winner != null) {
            /*Data.rawData.push({
                nPlayers: Players.length,
                winnerPlayerIndex: winner.index,
                winnerColor: Board[winner.position].color
            })*/
            Data.winsByColor[Board[winner.position].color] ++
            Data.nTotalWins ++
            Data.nRuns ++
            break
        }
    }
    console.log(`Run ${runNumber} finished.`)
}

let nRuns = 1000000
for (let i = 1; i<=nRuns; i++) {
    runTest(i)
}


require('fs').writeFile('results.json', JSON.stringify(Data, null, 4), err => {
    if (err) throw err
    console.log(`Wrote data for ${Data.rawData.length} runs!`)
})
