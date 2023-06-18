import { Dispatch } from "redux";
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    setIsInitializedAC,
    SetIsInitializedType,
} from "../../app/app-reducer";
import { authAPI } from "../../api/todolists-api";
import { LoginType } from "./Login";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false,
    
};
type InitialStateType = typeof initialState;

export const authReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return { ...state, isLoggedIn: action.value };
        
        default:
            return state;
    } 
};
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({ type: "login/SET-IS-LOGGED-IN", value } as const);

// thunks
export const loginTC =
    (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const result = await authAPI.login(data);
            if (result.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(result.data, dispatch);
            }
        } catch (e) {
            const error = e as { message: string };
            handleServerNetworkError(error, dispatch);
        }
    };
    export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
    
        try {
            const resul = await authAPI.me();
            if (resul.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setIsInitializedAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(resul.data, dispatch)
            }
        } catch (e) {
            const error = (e as { message: string })
            handleServerNetworkError(error, dispatch)
        }
    }
    export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
    
        try {
            const resul = await authAPI.logout();
            if (resul.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(resul.data, dispatch)
            }
        } catch (e) {
            const error = (e as { message: string })
            handleServerNetworkError(error, dispatch)
        }
    }

// types
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitializedType
