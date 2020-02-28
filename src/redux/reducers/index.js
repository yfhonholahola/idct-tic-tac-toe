import { combineReducers } from "redux";
import game from "./game";
import auth from "./auth";
import menu from "./menu";

export default combineReducers({ game, auth, menu });
