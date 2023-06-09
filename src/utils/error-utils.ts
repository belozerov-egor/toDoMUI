import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolists-api'
import {SetError, setError, SetStatusLoadingStatus, setStatusLoadingStatus} from "../app/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<ErrorUtilsDispatchType> ) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    } else {
        dispatch(setError('Some error occurred'))
    }
    dispatch(setStatusLoadingStatus('failed'))
}

export const handleServerNetworkError = (error: string , dispatch: Dispatch<ErrorUtilsDispatchType>) => {
    dispatch(setError(error))
    dispatch(setStatusLoadingStatus('failed'))
}

type ErrorUtilsDispatchType = SetStatusLoadingStatus | SetError
