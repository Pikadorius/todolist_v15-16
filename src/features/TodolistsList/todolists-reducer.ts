import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppActionType, setAppError, setAppStatus} from '../../app/appReducer';
import {AxiosError} from 'axios';

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
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
        case  'CHANGE-TODO-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
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
export const changeTodolistEntityStatusAC = (todolistId: string, status: EntityStatusType) => ({
    type: 'CHANGE-TODO-ENTITY-STATUS',
    status,
    todolistId
} as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatus('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatus('succeeded'))
            }).catch((e) => {
            dispatch(setAppError(e.message))
            dispatch(setAppStatus('failed'))
        })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatus('succeeded'))
                } else {
                    dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
                    dispatch(setAppStatus('failed'))
                    dispatch(setAppError(res.data.messages[0]))
                }
            }).catch((e: AxiosError) => {
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(e.message))
        })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatus('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatus('succeeded'))
                } else {
                    dispatch(setAppStatus('failed'))
                    dispatch(setAppError(res.data.messages[0]))
                }
            }).catch((e: AxiosError) => {
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(e.message))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatusAC(id, 'loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(changeTodolistEntityStatusAC(id, 'succeeded'))
                    dispatch(setAppStatus('succeeded'))
                } else {
                    dispatch(changeTodolistEntityStatusAC(id, 'failed'))
                    dispatch(setAppStatus('failed'))
                    dispatch(setAppError(res.data.messages[0]))
                }
            }).catch((e: AxiosError) => {
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(e.message))
        })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ChangeTodolistEntityStatusACType
    | AppActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type EntityStatusType = 'idle' | 'loading' | 'failed' | 'succeeded'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: EntityStatusType
}
