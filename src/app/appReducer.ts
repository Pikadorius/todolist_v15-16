import {EntityStatusType} from '../features/TodolistsList/todolists-reducer';

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



