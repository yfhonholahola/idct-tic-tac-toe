var express = require('express');
var logger = require('morgan');
var cors = require('cors');

var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());

var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(process.env.PORT || 3090, function(){
    console.log(`listening on *:${process.env.PORT || 3000}`);
    res.sendFile(__dirname + '/index.html');
});

var players = {},
    unmatched,
    turn,
    moveCount  = 0;

function joinGame(socket) {
    players[socket.id] = {
        opponent: unmatched,
        symbol: 'O',
        socket: socket,
    };

    // console.log(unmatched);
    if (unmatched && players[unmatched]) {
        players[socket.id].symbol = 'X';
        players[unmatched].opponent = socket.id;
        turn=players[unmatched].symbol
        unmatched = null        
    } else if (Object.keys(players).length < 2) {
        unmatched = socket.id;
    } else {
        players[socket.id].symbol = ''
    }
}

function getOpponent(socket) {
    if (!players[socket.id] || !players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}

function checkWin(matrix) {
    let winner = null, gameMatrix = Array.from(Object.values(matrix))
    const winningMoves = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    winningMoves.forEach((line, i) => {
        const a = winningMoves[i][0]
        const b = winningMoves[i][1]
        const c = winningMoves[i][2]

        // console.log('Compare', gameMatrix[a].value, gameMatrix[b].value, gameMatrix[c].value)
        // console.log('Compare 1', gameMatrix[a])
        // console.log('Compare 2', gameMatrix[a].value === gameMatrix[b].value)
        // console.log('Compare 3', gameMatrix[a].value === gameMatrix[c].value)
    
        if (!!gameMatrix[a].value &&
          !!gameMatrix[b].value &&
          !!gameMatrix[c].value &&
          gameMatrix[a].value === gameMatrix[b].value &&
          gameMatrix[a].value === gameMatrix[c].value) {
          winner = gameMatrix[a].value
        }
    })

    // console.log('winner: ', winner);
    // console.log('moveCount: ', moveCount);
    if (!winner && moveCount > 8) {
        winner = 'DRAW'
    }
    return winner
}

io.on('connection', function (socket) {
    console.log("Connection established...", socket.id);    
    joinGame(socket);

    if (getOpponent(socket)) {
        /*
        socket.emit('gameBegin', {
            symbol: players[socket.id].symbol,
            opponent: players[getOpponent(socket).id].opponent,
            turn: turn
        });
        getOpponent(socket).emit('gameBegin', {
            symbol: players[getOpponent(socket).id].symbol,
            opponent: players[getOpponent(socket).id].opponent,
            turn: turn
        });
        */

        Object.keys(players).map((key, index) => {
            const player = players[key]
            player.socket.emit('gameBegin', {
                symbol: player.symbol,
                opponent: player.opponent,
                turn: turn
            });
        })
    } else if (!players[socket.id].symbol && !players[socket.id].opponent && !!turn) {
        //send to viewer
        players[socket.id].socket.emit('gameBegin', {
            symbol: players[socket.id].symbol,
            opponent: players[socket.id].opponent,
            turn: turn
        });
    }

    // socket.on('newGame', function (data){
    //     console.log("Move made by : ", data);
    //     socket.emit('gameStart', 'Connected HaHaHa');
    // });

    socket.on('makeMove', function (data) {
        // console.log('Player ', turn, ' made a move');
        // console.log('Board \n', {...data});

        moveCount++

        let result = checkWin({...data})

        turn = (turn === players[socket.id].symbol) ? players[players[socket.id].opponent].symbol : players[socket.id].symbol;        

        Object.keys(players).map((key, index) => {
            const player = players[key]
            player.socket.emit('moveMade', { moves: {...data}, turn});
        })

        // socket.emit('moveMade', { moves: {...data}, turn});
        // getOpponent(socket).emit('moveMade', { moves: {...data}, turn});

        if (result) {
            console.log('result :', result)

            Object.keys(players).map((key, index) => {
                const player = players[key]
                player.socket.emit('gameEnd', { result });
            })

            // socket.emit('gameEnd', { result });
            // getOpponent(socket).emit('gameEnd', { result });                      
        }
    });

    socket.on('resetGame', function (data) {
        unmatched = undefined
        moveCount = 0 
        turn='O'
        Object.keys(players).map((key, index) => {
            const player = players[key]
            player.socket.emit('gameReset', { turn });
        })
    });

    // Emit an event to the opponent when the player leaves
    socket.on('disconnect', function (data) {
        console.log('Client disconnect', socket.id)
        if (players[socket.id]) {
            if (getOpponent(socket)) {
                // if (getOpponent(socket).connected)
                //     getOpponent(socket).disconnect(true);
                delete players[players[socket.id].opponent]
            }
            delete players[socket.id]
        }        
    });
});

//module.exports = app;