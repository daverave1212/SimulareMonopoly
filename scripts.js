
let seedrandom = require('seedrandom')
let rng = null

Board = []

let config = require('./entry-data.json')
if (config.rng == 'seedrandom')
    rng = seedrandom(config.seed)
else
    rng = Math.random

function randomInt(low, high) { return Math.floor(rng() * (high - low)) + low }
function d6() { return randomInt(1, 7) }
function log(message) { if (config.verbose) console.log(message) }

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

(function() {   // Board
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
})()

function resetBoard(){
    for (let tile of Board) {
        tile.owner = null
    }
}

function resetPlayers(){
    for (let player of Players) {
        player.position = 0   // On board
        player.ownedTiles = []
        player.nTurnsTaken = 0
    }
}

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
        log(`${this.name}'s turn:'`)
        let tilesToMove = d6() + d6()
        this.position += tilesToMove
        if(this.position >= Board.length){
            this.position -= Board.length
        }
        let thisTile = Board[this.position]
        log(`Moves ${tilesToMove} and lands on ${thisTile.name}...`)
        if (thisTile.owner == null && thisTile.isBuyable)
            this.buyTile(thisTile)
        else if (thisTile.isBuyable){
            log(`    Tile is already owned by ${thisTile.owner.name}!`)
        }
        else {
            log(`    Nothing to do.`)
        }
        if (this.doIHaveMonopoly(thisTile)) {
            log(`${this.name} wins the game and owns all ${thisTile.color} tiles!`)
            return true
        } else {
            return false
        }
    }

    buyTile(tile) {
        log(`    Buys tile ${tile.name}! (${tile.color})`)
        tile.owner = this
        this.ownedTiles.push(tile)
    }

    doIHaveMonopoly(tile) {
        let color = tile.color
        if (color == 'white') {
            log('   Not ownable.')
            return false
        }
        let owner = getAllTilesWithColor(color).filter( tile => tile.owner != null )
        if (owner.length == 0) {
            log('    Not owned at all')
            return false
        }
        owner = owner[0].owner
        if (owner != this) {
            log(`    Owner ${owner.name} not the same as ${this.name}`)
        }
        let nTotalTilesOfColor = getAllTilesWithColor(color).length
        let nTilesOfColorOwned = getAllTilesWithColor(color).filter( tile => tile.owner == owner ).length
        if (nTotalTilesOfColor == nTilesOfColorOwned) return true
        else {
            log(`    I just dont own all :(`)
            return false
        }
    }
}

for (let player of config.players) {
    new Player(player.name)
}

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
    function endWithDraw(){
        Data.rawData.push({
            nPlayers: Players.length,
            winnerPlayerIndex: null,
            winnerColor: null
        })
        Data.nDraws ++
        Data.nRuns ++
    }
    function endWithWinner(winner){
        Data.rawData.push({
            nPlayers: Players.length,
            winnerPlayerIndex: winner.index,
            winnerColor: Board[winner.position].color
        })
        Data.winsByColor[Board[winner.position].color] ++
        Data.nTotalWins ++
        Data.nRuns ++
    }

    resetBoard()
    resetPlayers()
    let roundIndex = 0
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
            log('Draw at the end of round ' + roundIndex)
            endWithDraw()
            break
        }
        if (winner != null) {
            endWithWinner(winner)
            break
        }
        roundIndex++
    }
    console.log(`Run ${runNumber} finished with ${roundIndex} loops.`)
}


for (let i = 1; i<=config.nRuns; i++) {
    runTest(i)
}


require('fs').writeFile('results.json', JSON.stringify(Data, null, 4), err => {
    if (err) throw err
    console.log(`Wrote data for ${Data.rawData.length} runs!`)
})
