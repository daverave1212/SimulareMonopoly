

Board = [
    { name : 'GO', color : 'white '},
    { name : 'Old Kent Road', color : 'brown' },
    { name : 'Community Chest', color : 'white'},
    { name : 'Whitechapel Road', color : 'brown' },
    { name : 'Income Tax', color : 'white' },
    { name : 'Kings Cross Station', color : 'black' },
    { name : 'The Angel, Islington', color : 'teal' },
    { name : 'Chance', color : 'white' },
    { name : 'Euston Road', color : 'teal' },
    { name : 'Pentounville Road', color : 'teal' },

    { name : 'Jail', color : 'white' },
    { name : 'Pall Mall', color : 'magenta' },
    { name : 'Electric Company', color : 'gold' },
    { name : 'Whitehall', color : 'magenta' },
    { name : 'Northumrl\'d Avenue', color : 'magenta' },
    { name : 'Marylebone Station', color : 'black' },
    { name : 'Bow Street', color : 'orange' },
    { name : 'Community Chest', color : 'white' },
    { name : 'Marlborough Street', color : 'orange' },
    { name : 'Vine Street', color : 'orange' },

    { name : 'Free Parking', color : 'white' },
    { name : 'Strand', color : 'red' },
    { name : 'Chance', color : 'white' },
    { name : 'Fleet Street', color : 'red' },
    { name : 'Trafalgar Square', color : 'red' },
    { name : 'Fenchurch ST. Station', color : 'black' },
    { name : 'Leicester Square', color : 'yellow' },
    { name : 'Coventry Street', color : 'yellow' },
    { name : 'Water WOrks', color : 'gold' },
    { name : 'Piccadilly', color : 'yellow' },

    { name : 'Go To Jail', color : 'white' },
    { name : 'Regent Street', color : 'green' },
    { name : 'Oxford Street', color : 'green' },
    { name : 'Community Chest', color : 'white' },
    { name : 'Bond Street', color : 'green' },
    { name : 'Liverpool ST. Station', color : 'black' },
    { name : 'Chance', color : 'white' },
    { name : 'Park Lane', color : 'blue' },
    { name : 'Super Tax', color : 'white' },
    { name : 'Mayfair', color : 'blue' }   
]

function getAllTilesWithColor(color){
    return Board.filter(tile => tile.color == color)
}

function allTilesWithColorAreOwnedBySamePlayer(color){
    let tiles = getAllTilesWithColor(color)
    let previousOwner = tiles[0].owner
    for(let tile of tiles){
        if(tile.owner != previousOwner) return false
        previousOwner = tile.owner
    }
    return true
}

(function setupBoardTilePositions(){
    for(let i = 0; i<Board.length; i++){
        Board[i].index = i
    }
})()

Players = []

class Player {
    constructor(){
        this.index = Players.length
        this.position = 0
        this.ownedTiles = []
        Players.push(this)
    }

    takeTurn(){
        let tilesToMove = d6() + d6()
        this.position += tilesToMove
        if(this.position >= Board.length){
            this.position -= Board.length
        }
        if(Board[this.position].owner == null)){
            Board[this.position].owner = this.index
            this.ownedTiles.push(Board[this.position])
        }
    }

    didIWin(){
        let ownedColors = this.ownedTiles.map(tile => tile.color)
        for(let color of ownedColors){
            
        }
    }
}
