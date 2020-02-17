import { CREATE_GAME, ON_MOVE, ON_MOVE_SUCCESS, END_GAME, EXIT_GAME, RESET_GAME, RESET_GAME_SUCCESS } from "../actionTypes";
import io from 'socket.io-client'

var socket = null;
const url = 'http://192.168.1.8:3090';
//const url = 'https://idct-tic-tac-toe-server.azurewebsites.net'

export const createGame = () => {    
    console.log('createGame');
    return dispatch => {
        return new Promise((resolve, reject) => {
            if (!socket) {
                console.log('websocket open');
                socket = io(url);
            }
            resolve(socket)
        })
        .catch(err => {
            console.log('error in createGame', err);
        })
        .then(socket => {
            socket.on('gameBegin', function (data) {
                dispatch({ type: CREATE_GAME, payload:{ ...data } })            
            })
            socket.on('moveMade', function (data) {
                const { moves, turn } = data
                dispatch({ type: ON_MOVE_SUCCESS, payload:{ moves: Array.from(Object.values(moves)), turn } })            
            })
            socket.on('gameEnd', function (data) {
                // socket.emit('disconnect')
                dispatch({ type: END_GAME, payload:{ result: data.result } })
            })
            socket.on('gameReset', function (data) {
                // socket.emit('disconnect')
                dispatch({ type: RESET_GAME_SUCCESS, payload:{ turn: data.turn } })
            })
        })       
    }
};

export const makeMove = payload => {
    let gameMatrix = {...payload}
    socket.emit('makeMove', {...gameMatrix})
    return { type: ON_MOVE }
}

export const exitGame = () => {
    if (socket) {
        socket.close()
    }
    return { type: EXIT_GAME }
}

export const resetGame = () => {
    socket.emit('resetGame')
    return { type: RESET_GAME }
}
