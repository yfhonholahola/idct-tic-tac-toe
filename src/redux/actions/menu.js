import { CONNECT_GAME, CONNECT_GAME_SUCCESS, CONNECT_GAME_FAILURE, 
    RECEIVE_MENU, RECEIVE_MENU_SUCCESS, RECEIVE_MENU_FAILURE, 
    REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE,
    CREATE_GAME, CREATE_GAME_SUCCESS, CREATE_GAME_FAILURE,
    JOIN_GAME, JOIN_GAME_SUCCESS, JOIN_GAME_FAILURE,
    SEND, SEND_SUCCESS, SEND_FAILURE, UPDATE_MENU
} from '../actionTypes';
import axios from 'axios';
import { SERVERURL } from '../../configuration'
import NavigationService from '../../utils/NavigationService';
import { initGame } from './game'

export const connectGameSuccess = (payload) => {
    return (dispatch, getState) => {
        //console.log('connectGameSuccess ' + JSON.stringify(payload));
        dispatch({
            type: 'socket',
            types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE],
            promise: (socket) => {
                return new Promise((resolve, reject) => {
                    socket.on('gameCreated', function() {
                        //console.log('gameCreated');
                        dispatch({type: CREATE_GAME_SUCCESS});
                        NavigationService.navigate('Game')
                    })

                    socket.on('gameJoined', function(data) {
                        //console.log('gameJoined'+JSON.stringify(data));
                        dispatch({type: JOIN_GAME_SUCCESS});
                        NavigationService.navigate('Game')
                    })
                    socket.on('roomUpdated', function(data) {
                        //console.log('roomUpdated', Array.isArray(data.rooms));
                        dispatch({type: UPDATE_MENU, payload: { rooms: Object.values(data.rooms), roomCount: data.roomCount }})                    
                        //console.log('client rooms: '+JSON.stringify(data.rooms)+' roomCount: '+data.roomCount);
                    })                    

                    return resolve();
                })
            }
        });
        return dispatch({ type: CONNECT_GAME_SUCCESS, payload: { socketid: payload.socketid, rooms: payload.rooms, roomCount: payload.roomCount }})
    }        
}

export const connectGame = () => {    
    return {
        type: 'socket',
        // types: [CONNECT_GAME, CONNECT_GAME_SUCCESS, CONNECT_GAME_FAILURE],
        types: [CONNECT_GAME, connectGameSuccess, CONNECT_GAME_FAILURE],
        promise: (socket) => socket.connect()
    }
    // return (dispatch, getState) => {
    //     const state = getState();
    //     const { socket } = getState();
    //     console.log('state: '+ state+ 'socket '+socket);
    //     return new Promise((resolve, reject) => {
    //         if (!socket) {
    //             console.log('websocket open');
    //             socket = io(url);
    //         }
    //         resolve(socket)
    //     }).catch(err => {
    //         console.log('error in connectGame', err);
    //     })
    // }
}

export const receiveMenu = () => {
    return (dispatch, getState) => {        
        //console.log('Receive Menu')
        dispatch({ type: RECEIVE_MENU });

        const suffix = '/getMenu';
    
        return axios.get(SERVERURL+suffix).then(response => {
            //console.log('Receive Menu response : '+JSON.stringify(response.data));
            dispatch({ type: RECEIVE_MENU_SUCCESS, ...response.data });
        }).catch(error => {
            //console.log('Receive Menu Error : '+error);
            dispatch({ type: RECEIVE_MENU_FAILURE });
        })
    }
}

export const createGame = () => {
    return (dispatch,getState) => {
        //console.log('createGame user:'+getState().auth.user);
        dispatch({
            type: 'socket',
            types: [SEND, createGameSuccess, CREATE_GAME_FAILURE],
            promise: (socket) => socket.emit('createGame', {user: getState().auth.user})
        })
        return dispatch({ type: CREATE_GAME })
    }
}

export const createGameSuccess = (payload) => {
    return (dispatch,getState) => {
        //console.log('createGameSuccess ' + JSON.stringify(payload));
        dispatch(initGame());
        return dispatch({ type: SEND_SUCCESS });
    }
}

export const joinGame = (payload) => {
    return (dispatch, getState) => {
        //console.log('joinGame:'+payload.id);
        dispatch({
            type: 'socket',
            types: [SEND, joinGameSuccess, CREATE_GAME_FAILURE],
            promise: (socket) => socket.emit('joinGame', {user: getState().auth.user, id: payload.id})
        })
        return dispatch({ type: JOIN_GAME });
    }
}

export const joinGameSuccess = (payload) => {
    return (dispatch,getState) => {
        //console.log('joinGameSuccess ' + JSON.stringify(payload));
        dispatch(initGame());
        return dispatch({ type: SEND_SUCCESS });        
    }
}