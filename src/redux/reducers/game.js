import { CREATE_GAME, ON_MOVE, ON_MOVE_SUCCESS, END_GAME, EXIT_GAME, RESET_GAME, RESET_GAME_SUCCESS } from "../actionTypes";

const initialState = {
    symbol: null,
    opponent: null,
    turn: null,
    moves: Array(9).fill({value: null, selected: false}),
    result: '',
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_GAME:
            return {
                ...state,
                symbol: action.payload.symbol,
                opponent: action.payload.opponent,
                turn: action.payload.turn,
            };
        case ON_MOVE:
            return state;
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
        case EXIT_GAME:
            return {...initialState, moves: Array(9).fill({value: null, selected: false})};
        case RESET_GAME:
            return state;
        case RESET_GAME_SUCCESS:
            return {
                ...state,
                moves: Array(9).fill({value: null, selected: false}),
                turn: action.payload.turn,
                result: ''
            }
        default:
            return state;
    }
}