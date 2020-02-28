import { TRY_AUTH, TRY_AUTH_SUCCESS, TRY_AUTH_FAILURE } from "../actionTypes";
import NavigationService from '../../utils/NavigationService';

const API_KEY = "AIzaSyBcojpsIDgolskrWffoWRN0tS_fNAqi2Q0";

export const tryAuth = (authData) => {
  return dispatch => {
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
      API_KEY;

    dispatch({ type: TRY_AUTH });
    // NavigationService.navigate('Menu')

    // return dispatch({ type: TRY_AUTH_SUCCESS, payload: { user: authData.email.substring(0, authData.email.indexOf('@')) } })

    return fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => {
        console.log(err);
        alert("Authentication failed, please try again!");
        dispatch({ type : TRY_AUTH_FAILURE });
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (!parsedRes.idToken) {
          alert("Authentication failed, please try again!"); 
          dispatch({ type : TRY_AUTH_FAILURE });
        } else {
          alert("Authentication Succeeded!"); 
          dispatch({ type : TRY_AUTH_SUCCESS, payload: { token: parsedRes.idToken, user: authData.email.substring(0, authData.email.indexOf('@')) }});
          NavigationService.navigate('Menu')
        }
      });    
  }
};
