import {AppThunkDispatch} from '../../app/store';
import {authAPI} from '../../api/todolists-api';
import {setAppError} from '../../app/appReducer';

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
    if (result.data.resultCode===0) {
        dispatch(setLoggedIn(true))
    } else {
        dispatch(setAppError(result.data.messages[0]))
    }
}