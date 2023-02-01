import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {useAppDispatch, useAppSelector} from '../../app/store';
import {setAppError, setAppStatus} from '../../app/appReducer';

export default function SimpleSnackbar() {
    const appError = useAppSelector<string | null>(state => state.app.error)
    const dispatch = useAppDispatch()


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppError(null))
    };

    const action = (
        <React.Fragment>

            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                open={appError!==null}
                autoHideDuration={6000}
                onClose={handleClose}
                message={appError}
                action={action}
            />
        </div>
    );
}