import { combineReducers } from "redux";
import game from "./game";
import auth from "./auth";

export default combineReducers({ game, auth });
