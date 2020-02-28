var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var util = require('util')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = [],
    rooms = [],
    roomCount = 0;
    //players = {},
    //unmatched,
    // turn,
    // moveCount  = 0;

function joinGame(socket, data) {
    const room = rooms.find(room => room.id == (data.id || socket.id));    
    let { name, id, players = {}, unmatched, turn } = room || {}

    players[socket.id] = {
        opponent: unmatched,
        symbol: 'O',
        socket,
    };

    // console.log(unmatched);
    if (unmatched && players[unmatched]) {
        players[socket.id].symbol = 'X';
        players[unmatched].opponent = socket.id;
        turn=players[unmatched].symbol
        unmatched = null
        name = name.replace('?', (data.user || '').toUpperCase())
    } else if (Object.keys(players).length < 2) {
        id = socket.id
        unmatched = socket.id
        turn = ''
        name = (data.user || '').toUpperCase() + ' / ?';
    } else {
        players[socket.id].symbol = ''
    }

    return {
        id,
        players,
        name,
        unmatched,
        turn,
        moveCount: 0
    }
}

/*
function getOpponent(socket) {
    if (!players[socket.id] || !players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}
*/

function getOpponent(roomid, socket) {
    const room = rooms.find(room => room.id == roomid);
    const { players = {} } = room

    if (!players[socket.id] || !players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}

function checkWin(matrix, moveCount) {
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
    console.log('Clients connected: ', io.engine.clientsCount) 
    console.log("Connection established...", socket.id)
    
    // if (users.includes(socket.handshake.address))
    //     return;
     
    users.push(socket.handshake.address);

    socket.on('createGame', function (data, fn){
        fn({msg:'OK', error:''});
        if (!rooms.find(room => room.id == socket.id)) {            
            //console.log('new room id: ', socket.id);
            //console.log('createRoom: '+ JSON.stringify(data));
            const room = joinGame(socket, data);
            rooms.push(room);
            roomCount++;            
            // console.log(JSON.stringify(
            //     rooms.map(item => ({ 
            //         ...item, 
            //         players: Object.keys(item.players).reduce((obj,key) => {
            //             const { opponent, symbol } = item.players[key];
            //             return Object.assign(obj, { [key]: { opponent, symbol }})
            //         }, {}) 
            //     }))
            // ));
            socket.join(room.id);
            socket.emit('gameCreated', {});
            io.emit('roomUpdated', { rooms: rooms.map(item => ({ 
                ...item, 
                players: Object.keys(item.players).reduce((obj,key) => {
                    const { opponent, symbol } = item.players[key];
                    return Object.assign(obj, { [key]: { opponent, symbol }})
                }, {}) 
            })), roomCount: roomCount});
        }
    });

    socket.on('joinGame', function (data, fn) {
        fn({msg:'OK', error:''});
        const roomid = data.id || '';

        if (rooms.find(room => room.id == roomid)) {
            const index = rooms.findIndex(room => room.id == roomid);
            rooms[index] = joinGame(socket, data);
            // console.log(JSON.stringify(
            //     rooms.map(item => ({ 
            //         ...item, 
            //         players: Object.keys(item.players).reduce((obj,key) => {
            //             const { opponent, symbol } = item.players[key];
            //             return Object.assign(obj, { [key]: { opponent, symbol }})
            //         }, {}) 
            //     }))
            // ));
            socket.join(roomid);
            socket.emit('gameJoined', {});
            io.emit('roomUpdated', { rooms: rooms.map(item => ({ 
                ...item, 
                players: Object.keys(item.players).reduce((obj,key) => {
                    const { opponent, symbol } = item.players[key];
                    return Object.assign(obj, { [key]: { opponent, symbol }})
                }, {}) 
            })), roomCount: roomCount});                        

            if (getOpponent(roomid, socket)) {

                // socket.emit('gameBegin', {
                //     symbol: players[socket.id].symbol,
                //     opponent: players[getOpponent(socket).id].opponent,
                //     turn: turn
                // });
                // getOpponent(socket).emit('gameBegin', {
                //     symbol: players[getOpponent(socket).id].symbol,
                //     opponent: players[getOpponent(socket).id].opponent,
                //     turn: turn
                // });

                // console.log('Object.keys(rooms[index].players) ',Object.keys(rooms[index].players).toString())
                Object.keys(rooms[index].players).map(key => {                    
                    const player = rooms[index].players[key]
                    // console.log('player:',player.socket.id,'- symbol:',player.symbol,'- opponent:',player.opponent);
                    player.socket.emit('gameBegin', {
                        roomid: rooms[index].id,
                        roomname: rooms[index].name,                                
                        symbol: player.symbol,
                        opponent: player.opponent,
                        turn: rooms[index].turn
                    });                    
                })             
            } else if (!rooms[index].players[socket.id].symbol && !rooms[index].players[socket.id].opponent && !!rooms[index].turn) {
                //send to viewer
                rooms[index].players[socket.id].socket.emit('gameBegin', {
                    roomid: rooms[index].id,
                    roomname: rooms[index].name,                    
                    symbol: rooms[index].players[socket.id].symbol,
                    opponent: rooms[index].players[socket.id].opponent,
                    turn: rooms[index].turn
                });
            }            
        }
    })

    //Original logic - Temporary block for create room
    /*
    joinGame(socket);

    if (getOpponent(socket)) {

        // socket.emit('gameBegin', {
        //     symbol: players[socket.id].symbol,
        //     opponent: players[getOpponent(socket).id].opponent,
        //     turn: turn
        // });
        // getOpponent(socket).emit('gameBegin', {
        //     symbol: players[getOpponent(socket).id].symbol,
        //     opponent: players[getOpponent(socket).id].opponent,
        //     turn: turn
        // });


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
    */

    socket.on('makeMove', function (data, fn) {
        // console.log('Player ', turn, ' made a move');
        // console.log('Board \n', {...data});
        fn({msg:'OK', error:''});

        const { roomid, gameMatrix } = data;
        const room = rooms.find(room => room.id == roomid);

        if (!!room) {
            room.moveCount++

            let result = checkWin({...gameMatrix}, room.moveCount)
    
            room.turn = (room.turn === room.players[socket.id].symbol) ? room.players[room.players[socket.id].opponent].symbol : room.players[socket.id].symbol;        
                
            // Object.keys(room.players).map((key, index) => {
            //     const player = room.players[key]
            //     console.log('player:', player.symbol, ' - moveMade:', {...data}, ' - turn:', room.turn)
            //     player.socket.emit('moveMade', { moves: {...data.gameMatrix}, turn: room.turn});
            // })
            io.in(roomid).emit('moveMade', { moves: {...data.gameMatrix}, turn: room.turn});
    
            // socket.emit('moveMade', { moves: {...data}, turn});
            // getOpponent(socket).emit('moveMade', { moves: {...data}, turn});
    
            if (result) {
                console.log('result :', result)
    
                // Object.keys(room.players).map((key, index) => {
                //     const player = room.players[key]
                //     player.socket.emit('gameEnd', { result });
                // })
                room.win = result;
                io.in(roomid).emit('gameEnd', { result });
    
                // socket.emit('gameEnd', { result });
                // getOpponent(socket).emit('gameEnd', { result });                      
            }
        }
    });

    socket.on('resetGame', function (data, fn) {
        fn({msg:'OK', error:''});

        const { roomid } = data;
        const room = rooms.find(room => room.id == roomid);
        if (!!room) {
            room.unmatched = undefined
            room.moveCount = 0 
            room.turn='O'
            delete room.win
            io.in(roomid).emit('gameReset', { turn: room.turn });
        }
    });

    socket.on('exitGame', function (data, fn) {
        fn({msg:'OK', error:''});
        console.log('exitGame');
        const { roomid } = data;
        const index = rooms.findIndex(room => room.id == roomid);
        if (index > -1) {
                io.in(roomid).emit('gameExit');
                Object.keys(rooms[index].players).map(key => rooms[index].players[key].socket.leave(roomid));

                rooms.splice(index, 1);
                roomCount--;
            
            io.emit('roomUpdated', { rooms: rooms.map(item => ({ 
                ...item, 
                players: Object.keys(item.players).reduce((obj,key) => {
                    const { opponent, symbol } = item.players[key];
                    return Object.assign(obj, { [key]: { opponent, symbol }})
                }, {}) 
            })), roomCount: roomCount});            
        }
    });

    // Emit an event to the opponent when the player leaves
    socket.on('disconnect', function (data) {
        console.log('Client disconnect', socket.id)
        if (users[socket.handshake.address]) {
            delete users[socket.handshake.address]
        }        
    });

   socket.emit('connected', { socketid: socket.id,
    rooms: rooms.map(item => ({ 
        ...item, 
        players: Object.keys(item.players).reduce((obj,key) => {
            const { opponent, symbol } = item.players[key];
            return Object.assign(obj, { [key]: { opponent, symbol }})
        }, {}) 
    })), roomCount: roomCount});
});

app.get('/getMenu', function(req, res){
    res.json({'rooms': rooms.map(item => ({ 
        ...item, 
        players: Object.keys(item.players).reduce((obj,key) => {
            const { opponent, symbol } = item.players[key];
            return Object.assign(obj, { [key]: { opponent, symbol }})
        }, {}) 
    })), 'roomCount': roomCount});
});

http.listen(process.env.PORT || 3090, () => {
    console.log(`listening on *:${process.env.PORT || 3000}`);
});

//module.exports = app;