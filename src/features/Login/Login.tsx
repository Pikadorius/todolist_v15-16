import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useAppDispatch, useAppSelector} from '../../app/store';
import {Navigate} from 'react-router-dom';
import {SubmitHandler, useForm} from 'react-hook-form';
import {RequestLoginType} from '../../api/todolists-api';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {login} from './authReducer';

export const Login = () => {
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLogged)
    const dispatch = useAppDispatch()

    const schema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(5).required(),
    }).required();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RequestLoginType>({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    });
    const onSubmit: SubmitHandler<RequestLoginType> = (data) => dispatch(login(data))

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...register('email')}/>
                        {errors.email && <div style={{color:'red'}}>{errors.email.message}</div>}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...register('password')}
                        />
                        {errors.password && <div style={{color:'red'}}>{errors.password.message}</div>}
                        <FormControlLabel label={'Remember me'} control={<Checkbox/>} {...register('rememberMe')}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}