import { CONNECT_GAME, CONNECT_GAME_SUCCESS, CONNECT_GAME_FAILURE, 
    CREATE_GAME, CREATE_GAME_SUCCESS, CREATE_GAME_FAILURE,
    JOIN_GAME, JOIN_GAME_SUCCESS, JOIN_GAME_FAILURE,
    RECEIVE_MENU, RECEIVE_MENU_SUCCESS, RECEIVE_MENU_FAILURE,
    SEND, SEND_SUCCESS, SEND_FAILURE,
    REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE,
    UPDATE_MENU  
} from "../actionTypes";

const initialState = {
    socketid: '',
    rooms: [],
    roomCount: 0,
    isConnected: false,
    isReceived: false,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CONNECT_GAME:
            return {...state, isConnected: false};
        case CONNECT_GAME_SUCCESS:
            return {
                ...state, 
                socketid: action.payload.socketid,
                rooms: action.payload.rooms,
                roomCount: action.payload.roomCount,
                isConnected: true
            };
        case CONNECT_GAME_FAILURE:
            return {
                ...state,
                socketid: initialState.socketid,                
                rooms: initialState.rooms,
                roomCount: initialState.roomCount, 
                isConnected: false};            
        case CREATE_GAME, CREATE_GAME_SUCCESS, CREATE_GAME_FAILURE:
            return state;
        case JOIN_GAME, JOIN_GAME_SUCCESS, JOIN_GAME_FAILURE:
            return state;
        case RECEIVE_MENU:
            return {...state, isReceived: false};
        case RECEIVE_MENU_SUCCESS:
            return {...state, isReceived: true};
        case RECEIVE_MENU_FAILURE:
            return {...state, isReceived: false};
        case UPDATE_MENU:
            return {
                ...state,    
                rooms: action.payload.rooms,
                roomCount: action.payload.roomCount,
                ...action.payload
            }
        case SEND, SEND_SUCCESS, SEND_FAILURE, REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE:
        default:
            return state;        
    }
}