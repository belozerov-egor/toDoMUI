export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":{
            return {...state, error: action.status}
        }
        default:
            return state
    }
}

export const setStatusLoadingStatus = (status: RequestStatusType) => {
return {
    type : 'APP/SET-STATUS', status
}as const
}
export const setError = (status: null | string) => {
return {
    type : 'APP/SET-ERROR', status
}as const
}

export type SetStatusLoadingStatus = ReturnType<typeof setStatusLoadingStatus>
export type SetError = ReturnType<typeof setError>
type AppActionsType = SetStatusLoadingStatus | SetError