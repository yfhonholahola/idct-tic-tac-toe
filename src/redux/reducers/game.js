import { ON_MOVE, ON_MOVE_SUCCESS, END_GAME, EXIT_GAME, RESET_GAME, RESET_GAME_SUCCESS, INIT_GAME, INIT_GAME_SUCCESS, EXIT_GAME_SUCCESS } from "../actionTypes";

const initialState = {
    roomid: null,
    roomname: null,
    symbol: null,
    opponent: null,
    turn: null,
    moves: Array(9).fill({value: null, selected: false}),
    result: '',
}

export default function(state = initialState, action) {
    switch (action.type) {
        // case CREATE_GAME:
        //     return {
        //         ...state,
        //         symbol: action.payload.symbol,
        //         opponent: action.payload.opponent,
        //         turn: action.payload.turn,
        //     };
        case INIT_GAME_SUCCESS:
            return {
                ...state,
                roomid: action.payload.roomid,
                roomname: action.payload.roomname,
                symbol: action.payload.symbol,
                opponent: action.payload.opponent,
                turn: action.payload.turn,
            };            
        case ON_MOVE_SUCCESS:
            return {
                ...state,
                moves: action.payload.moves,
                turn: action.payload.turn,
            }
        case END_GAME:
            return {
                ...state,
                result: action.payload.result
            }
        case EXIT_GAME_SUCCESS:
            return initialState;
        case RESET_GAME_SUCCESS:
            return {
                ...state,
                moves: Array(9).fill({value: null, selected: false}),
                turn: action.payload.turn,
                result: ''
        
            }
        case EXIT_GAME:
        case INIT_GAME:            
        case ON_MOVE:            
        case RESET_GAME:            
        default:
            return state;
    }
}