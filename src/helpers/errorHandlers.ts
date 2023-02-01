import {setAppError, setAppStatus} from '../app/appReducer';
import {AppThunkDispatch} from '../app/store';
import {ResponseType} from '../api/todolists-api';

export const responseErrorHandler = <T>(data: ResponseType<T>, dispatch: AppThunkDispatch) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occured'))
    }
    dispatch(setAppStatus('failed'))
}

export const networkErrorHandler = (e: any, dispatch: AppThunkDispatch) => {
    dispatch(setAppStatus('failed'))
    dispatch(setAppError(e.message))
}