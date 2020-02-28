import { TRY_AUTH, TRY_AUTH_SUCCESS, TRY_AUTH_FAILURE } from "../actionTypes";

const initialState = { 
  token: '',
  user: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case TRY_AUTH:
        return {
          ...state,
        };
      case TRY_AUTH_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
        };
      case TRY_AUTH_FAILURE:
        return {
          ...state,
          token: ''
        };
      default:
        return state;
    }
};

export default reducer;
