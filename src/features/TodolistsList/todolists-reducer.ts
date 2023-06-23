import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {appActions, RequestStatusType} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []


const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ todolistId: string}>)=> {
           const index = state.findIndex(task=> task.id === action.payload.todolistId)
           if(index !== -1){
            state.splice(index, 1)
           }
    },
    addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>)=> {
        return [{...action.payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
 },
 changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string}>)=>{
    const index = state.findIndex(todo=> todo.id === action.payload.todolistId)
    if(index!== -1){
        state[index].title = action.payload.title
    }
 },
 changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>)=> {
    const index = state.findIndex(todo=> todo.id === action.payload.todolistId)
    if(index!== -1){
        state[index].filter = action.payload.filter
    }
    
 },
 changeTodolistEntityStatus: (state, action: PayloadAction<{todolistId: string, status: RequestStatusType}>)=> {
    const index = state.findIndex(todo=> todo.id === action.payload.todolistId)
    if(index !== -1){
        state[index].entityStatus = action.payload.status
    }
 },
 setTodolists: (state, action: PayloadAction<{todolists: Array<TodolistType>}>)=> {
    return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
 }
}})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status:'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string):AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
            })
    }
}

// types

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
