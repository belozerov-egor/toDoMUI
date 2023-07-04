import {AppRootStateType} from "../../app/store";


export const AuthSelector = (state: AppRootStateType) => state.auth;
export const IsLoggedInSelector = (state: AppRootStateType) => state.auth.isLoggedIn;


