import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetStatusLoadingStatus, setStatusLoadingStatus} from "../../app/app-reducer";
import {handleServerAppError} from "../../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-entityStatus":
            return state.map(tl=> tl.id === action.todoId ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeEntityStatusAC = (todoId: string, status: RequestStatusType) => ({type: 'CHANGE-entityStatus', todoId,status } as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<TodolistActionType>) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setStatusLoadingStatus("succeeded"))
                dispatch(setTodolistsAC(res.data))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<TodolistActionType>) => {
        dispatch(setStatusLoadingStatus("loading"))
        dispatch(changeTodolistTitleAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(setStatusLoadingStatus("succeeded"))
                dispatch(removeTodolistAC(todolistId))
            }).catch(()=> {
            dispatch(changeTodolistTitleAC(todolistId, 'failed'))
        })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<TodolistActionType>) => {
        dispatch(setStatusLoadingStatus("loading"))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if(res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(setStatusLoadingStatus("succeeded"))
                    dispatch(addTodolistAC(res.data.data.item))
                }else {
                    handleServerAppError<{ item: TodolistType }>(res.data, dispatch)
                }

            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<TodolistActionType>) => {
        dispatch(setStatusLoadingStatus("loading"))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(setStatusLoadingStatus("succeeded"))
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type TodolistActionType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | SetTodolistsActionType
    | SetStatusLoadingStatus
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
