import { AUTH_SET_TOKEN } from "../actionTypes";
import NavigationService from '../../utils/NavigationService';

const API_KEY = "AIzaSyBcojpsIDgolskrWffoWRN0tS_fNAqi2Q0";

export const tryAuth = (authData) => {
  return dispatch => {
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
      API_KEY;
      NavigationService.navigate('Menu')
    // fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     email: authData.email,
    //     password: authData.password,
    //     returnSecureToken: true
    //   }),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .catch(err => {
    //     console.log(err);
    //     alert("Authentication failed, please try again!");
    //   })
    //   .then(res => res.json())
    //   .then(parsedRes => {
    //     console.log(parsedRes);
    //     if (!parsedRes.idToken) {
    //       alert("Authentication failed, please try again!"); 
    //       //parsedRes.reject();         
    //     } else {
    //       alert("Authentication Succeeded!"); 
    //       dispatch({ type : AUTH_SET_TOKEN, payload: { token: parsedRes.idToken }});
    //       NavigationService.navigate('Game')
    //     }
    //   });
  };
};
