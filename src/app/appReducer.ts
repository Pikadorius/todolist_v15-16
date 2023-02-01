import {EntityStatusType} from '../features/TodolistsList/todolists-reducer';
import {AppThunkDispatch} from './store';
import {authAPI, RequestLoginType} from '../api/todolists-api';
import {setLoggedIn} from '../features/Login/authReducer';

type AppInitialStateType = {
    status: EntityStatusType
    error: string | null
}

const appInitialState: AppInitialStateType = {
    status: 'idle',
    error: null
}

export const appReducer = (state = appInitialState, action: AppActionType): AppInitialStateType => {
    switch (action.type) {
        case 'SET_APP_STATUS':
            return {...state, status: action.status}
        case 'SET_APP_ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppStatus = (status: EntityStatusType) => ({type: 'SET_APP_STATUS', status} as const)
export const setAppError = (error: string | null) => ({type: 'SET_APP_ERROR', error} as const)


export type AppActionType =
    ReturnType<typeof setAppStatus>
    | ReturnType<typeof setAppError>



export const login = (data: RequestLoginType) => async (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus('loading'))
    const result = await authAPI.login(data)
    if (result.data.resultCode===0) {
        dispatch(setLoggedIn(true))
        dispatch(setAppStatus('succeeded'))
    } else {
        dispatch(setAppError(result.data.messages[0]))
        dispatch(setAppStatus('failed'))
    }
}

export const logout = () => async (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus('loading'))
    const result = await authAPI.logout()
    if (result.data.resultCode===0) {
        dispatch(setAppStatus('succeeded'))
        dispatch(setLoggedIn(false))
    } else {
        dispatch(setAppStatus('failed'))
        dispatch(setAppError(result.data.messages[0]))
    }
}