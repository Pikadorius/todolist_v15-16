import {EntityStatusType} from '../features/TodolistsList/todolists-reducer';
import {AppThunkDispatch} from './store';
import {authAPI, RequestLoginType} from '../api/todolists-api';

type AppInitialStateType = {
    status: EntityStatusType
    error: string | null
    loggedIn: boolean
}

const appInitialState: AppInitialStateType = {
    status: 'idle',
    error: null,
    loggedIn: false
}

export const appReducer = (state = appInitialState, action: AppActionType): AppInitialStateType => {
    switch (action.type) {
        case 'SET_APP_STATUS':
            return {...state, status: action.status}
        case 'SET_APP_ERROR':
            return {...state, error: action.error}
        case 'SET_APP_LOGGED':
            return {...state, loggedIn: action.isLoggedIn}
        default:
            return state
    }
}

export const setAppStatus = (status: EntityStatusType) => ({type: 'SET_APP_STATUS', status} as const)
export const setAppError = (error: string | null) => ({type: 'SET_APP_ERROR', error} as const)
export const setAppLogged = (isLoggedIn: boolean) => ({type: 'SET_APP_LOGGED', isLoggedIn} as const)


export type AppActionType =
    ReturnType<typeof setAppStatus>
    | ReturnType<typeof setAppError>
    | ReturnType<typeof setAppLogged>

export const authMe = () => async (dispatch: AppThunkDispatch) => {
    const result = await authAPI.me()
    if (result.data.resultCode===0) {
        dispatch(setAppLogged(true))
    } else {
        dispatch(setAppError(result.data.messages[0]))
    }
}

export const login = (data: RequestLoginType) => async (dispatch: AppThunkDispatch) => {
    const result = await authAPI.login(data)
    if (result.data.resultCode===0) {
        dispatch(setAppLogged(true))
    } else {
        dispatch(setAppError(result.data.messages[0]))
    }
}

export const logout = () => async (dispatch: AppThunkDispatch) => {
    const result = await authAPI.logout()
    if (result.data.resultCode===0) {
        dispatch(setAppLogged(false))
    } else {
        dispatch(setAppError(result.data.messages[0]))
    }
}