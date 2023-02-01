import {AppThunkDispatch} from '../../app/store';
import {authAPI, RequestLoginType} from '../../api/todolists-api';
import {setAppError, setAppStatus} from '../../app/appReducer';
import {networkErrorHandler, responseErrorHandler} from '../../helpers/errorHandlers';

type AuthInititalStateType = {
    isLogged: boolean
}

const initialState: AuthInititalStateType = {
    isLogged: false
}

export const authReducer = (state = initialState, action: ReturnType<typeof setLoggedIn>): AuthInititalStateType => {
    switch (action.type) {
        case 'SET_LOGGED':
            return {...state, isLogged: action.isLogged}
        default:
            return state
    }
}

export const setLoggedIn = (isLogged: boolean) => ({type: 'SET_LOGGED', isLogged} as const)

export const authMe = () => async (dispatch: AppThunkDispatch) => {
    const result = await authAPI.me()
    if (result.data.resultCode === 0) {
        dispatch(setLoggedIn(true))
    } else {
        dispatch(setAppError(result.data.messages[0]))
    }
}

export const login = (data: RequestLoginType) => async (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus('loading'))
    try {
        const result = await authAPI.login(data)
        if (result.data.resultCode === 0) {
            dispatch(setLoggedIn(true))
            dispatch(setAppStatus('succeeded'))
        } else {
            responseErrorHandler(result.data, dispatch)
        }
    } catch (e) {
        networkErrorHandler(e, dispatch)
    }
}

export const logout = () => async (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus('loading'))
    const result = await authAPI.logout()
    if (result.data.resultCode === 0) {
        dispatch(setAppStatus('succeeded'))
        dispatch(setLoggedIn(false))
    } else {
        dispatch(setAppStatus('failed'))
        dispatch(setAppError(result.data.messages[0]))
    }
}