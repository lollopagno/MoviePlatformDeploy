import React, {useEffect, useState} from 'react'
import {signInSuccess} from "../../../redux/reducer/userReducer";
import {request} from '../../../requests/user'
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {MdLocalMovies} from 'react-icons/md';
import {useStyles} from "./styles";
import {store} from '../../../redux/store'
import history from '../../../history'
import {useSelector} from "react-redux";
import {Alert} from "@material-ui/lab";
import {meFromTokenSuccess} from "../../../redux/reducer/tokenReducer";
import {resetAlert} from "../../../redux/reducer/signInReducer";
import clsx from "clsx";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © ' + new Date().getFullYear() + '.'}
        </Typography>
    );
}

/**
 * Component to authenticate a user
 * @returns {JSX.Element}
 * @constructor
 */
function SignIn() {

    const classes = useStyles();
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    })
    const {username, password} = userData
    const [typePassword, setTypePassword] = useState(false);
    const [infoAlert, setInfoAlert] = useState(null)
    const [stateAlert, setStateAlert] = useState(false)
    const alertRedux = useSelector(state => state.signIn)

    useEffect(() => {

        // Check tp show alert
        if (alertRedux.alert !== undefined && alertRedux.alert.length > 0) {
            setInfoAlert(alertRedux.alert)
            setStateAlert(alertRedux.isSuccess)
            store.dispatch(resetAlert())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Action to change username and password
     * @param event value
     */
    const onChange = event => {
        const {value, name} = event.target
        setUserData({...userData, [name]: value})
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /**
     * Reset password and username
     */
    const onReset = () => {
        setUserData({...userData, username: '', password: ''})
        setTypePassword(false)
        setInfoAlert(null)
        setStateAlert(false)
    }

    /**
     * Send password and username to server
     * @param event
     */
    const onSubmit = event => {
        event.preventDefault()

        request.signIn(userData).then(res => {
            setStateAlert(false)
            setInfoAlert(null)
            store.dispatch(signInSuccess(res.data.data))
            store.dispatch(meFromTokenSuccess(res.data.token));
            history.push('/dashboard')
        }).catch(err => {
            setStateAlert(false)
            setInfoAlert(err.response.data.message)
            setUserData({...userData, password: ''})
        })

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <MdLocalMovies/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} onReset={onReset} noValidate>
                    <TextField
                        required
                        fullWidth
                        autoFocus
                        variant="outlined"
                        margin="normal"
                        id="username"
                        label="Username or email"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={onChange}
                    />
                    <FormControl variant="outlined"
                                 className={clsx(classes.marginFormControl, classes.textFieldFormControl)}>
                        <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={typePassword ? 'text' : 'password'}
                            name={'password'}
                            value={password}
                            onChange={onChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setTypePassword(!typePassword)
                                        }}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {typePassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={82}
                        />
                    </FormControl>
                    <Grid container justify={"center"} className={classes.alert}>
                        {infoAlert &&
                        <Alert severity={stateAlert ? 'success' : 'error'} variant="standard">
                            {infoAlert}
                        </Alert>}
                    </Grid>
                    <Grid container justify={'center'} className={classes.button} spacing={4}>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                value="submit"
                            >
                                Sign In
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="reset"
                                variant="contained"
                                color="primary"
                                value="reset"
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.link}>
                        <Grid item xs>
                            <Link href={'/signUp'} variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={3}>
                <Copyright/>
            </Box>
        </Container>
    );
}

export default SignIn;
