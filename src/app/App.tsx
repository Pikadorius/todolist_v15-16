import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'

// You can learn about the difference by reading this guide on minimizing bundle size.
// https://mui.com/guides/minimizing-bundle-size/
// import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppDispatch, useAppSelector} from './store';
import {EntityStatusType} from '../features/TodolistsList/todolists-reducer';
import SimpleSnackbar from '../components/SnackBar/SnackBar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {authMe, logout} from './appReducer';


function App() {

    const appStatus = useAppSelector<EntityStatusType>(state => state.app.status)
    const isLoggedIn = useAppSelector<boolean>(state => state.app.loggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(authMe())
    }, [])

    const logOut = () => {
        dispatch(logout())
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOut}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {appStatus === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h2 style={{textAlign: 'center', color:'red'}}>ERROR 404</h2>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <SimpleSnackbar/>
        </div>
    )
}

export default App
