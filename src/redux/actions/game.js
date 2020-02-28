import { 
    ON_MOVE, ON_MOVE_SUCCESS, ON_MOVE_FAILURE,
    END_GAME, END_GAME_SUCCESS, END_GAME_FAILURE,
    EXIT_GAME, EXIT_GAME_SUCCESS, EXIT_GAME_FAILURE,
    RESET_GAME, RESET_GAME_SUCCESS, RESET_GAME_FAILURE,
    INIT_GAME, INIT_GAME_SUCCESS, INIT_GAME_FAILURE, 
    REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE,
    SEND, SEND_SUCCESS, SEND_FAILURE
} from "../actionTypes";
import NavigationService from '../../utils/NavigationService';

//const url = 'https://idct-tic-tac-toe-server.azurewebsites.net'

// export const createGame = () => {    
//     console.log('createGame');
//export const connectGame = () => {    
    // console.log('connectGame');
    // return dispatch => {
    //     return new Promise((resolve, reject) => {
    //         if (!socket) {
    //             console.log('websocket open');
    //             socket = io(url);
    //         }
    //         resolve(socket)
    //     })
    //     .catch(err => {
    //         console.log('error in connectGame', err);
    //     })
    //     .then(socket => {
    //         socket.on('gameCreated', function(data) {
    //             console.log('rooms: '+data.rooms+' roomCount: '+data.roomCount);
    //             dispatch({ type: CREATE_GAME })
    //         });
    //         socket.on('gameBegin', function (data) {
    //             dispatch({ type: CREATE_GAME, payload:{ ...data } })            
    //         })
    //         socket.on('moveMade', function (data) {
    //             const { moves, turn } = data
    //             dispatch({ type: ON_MOVE_SUCCESS, payload:{ moves: Array.from(Object.values(moves)), turn } })            
    //         })
    //         socket.on('gameEnd', function (data) {
    //             // socket.emit('disconnect')
    //             dispatch({ type: END_GAME, payload:{ result: data.result } })
    //         })
    //         socket.on('gameReset', function (data) {
    //             // socket.emit('disconnect')
    //             dispatch({ type: RESET_GAME_SUCCESS, payload:{ turn: data.turn } })
    //         })
    //     })       
    // }
//};

// export const createGame = payload => {
//     console.log('client-side createGame'+payload);
//     socket.emit('createGame', { ...payload })
//     return { type: CREATE_GAME }
// }

export const initGame = () => {
    return dispatch => {
        dispatch({ type: INIT_GAME })
        dispatch({
            type: 'socket',
            types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE],
            promise: (socket) => {
                return new Promise((resolve, reject) => {
                    socket.on('gameBegin', function (data) {
                        // console.log('gameBegin'+JSON.stringify(data))
                        dispatch({ type: INIT_GAME_SUCCESS, payload: { ...data } });
                    })
                    socket.on('moveMade', function (data) {
                        const { moves, turn } = data
                        // console.log('moveMade:', moves,'- turn:',turn)
                        dispatch({ type: ON_MOVE_SUCCESS, payload:{ moves: Array.from(Object.values(moves)), turn } })                                
                    })
                    socket.on('gameEnd', function (data) {          
                        dispatch({ type: END_GAME, payload:{ result: data.result } })                              
                    })
                    socket.on('gameReset', function (data) {
                        dispatch({ type: RESET_GAME_SUCCESS, payload:{ turn: data.turn } })                    
                    })
                    socket.on('gameExit', function (data) {
                        dispatch({ type: EXIT_GAME_SUCCESS })
                        NavigationService.navigate('Menu')                 
                    })                    

                    return resolve()
                })            
            }
        })
    }
}

export const makeMove = payload => {
    const gameMatrix = {...payload}
    return (dispatch,getState) => {
        //console.log('makeMove payload:'+ {...gameMatrix});
        dispatch({
            type: 'socket',
            types: [SEND, SEND_SUCCESS, SEND_FAILURE],
            promise: (socket) => socket.emit('makeMove', {roomid: getState().game.roomid, gameMatrix: {...gameMatrix}})
        })
        return dispatch({ type: ON_MOVE })
    }

}

export const exitGame = () => {
    return (dispatch,getState) => {
        console.log('exitGame:');
        dispatch({
            type: 'socket',
            types: [SEND, SEND_SUCCESS, SEND_FAILURE],
            promise: (socket) => socket.emit('exitGame', { roomid: getState().game.roomid })
        })
        return dispatch({ type: EXIT_GAME })
    }
}

export const resetGame = () => {
    return (dispatch,getState) => {
        console.log('resetGame:');
        dispatch({
            type: 'socket',
            types: [SEND, SEND_SUCCESS, SEND_FAILURE],
            promise: (socket) => socket.emit('resetGame', { roomid: getState().game.roomid })
        })
        return dispatch({ type: RESET_GAME })
    }    
}
