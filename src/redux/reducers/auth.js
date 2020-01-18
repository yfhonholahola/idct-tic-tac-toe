import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "../actionTypes";

const initialState = { 
  token: '' 
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case TRY_AUTH:
        return {
          ...state,
        };      
      case AUTH_SET_TOKEN:
        return {
          ...state,
          token: action.payload.token,
        };
      case AUTH_REMOVE_TOKEN:
        return {
          ...state,
        };
      default:
        return state;
    }
};

export default reducer;
