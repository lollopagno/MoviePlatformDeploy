import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import {AccountCircle, Edit} from "@material-ui/icons";
import {useSelector} from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import {request} from "../../../requests/user";
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import {changeData, resetUser} from "../../../redux/reducer/userReducer";
import {store} from "../../../redux/store";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {deleteToken} from "../../../redux/reducer/tokenReducer";
import {setAlert} from "../../../redux/reducer/signInReducer";
import history from "../../../history";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import {resetList, resetNotice} from "../../../redux/reducer/socketReducer";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
    },
    contText: {
        marginTop: theme.spacing(5)
    },
    check: {
        marginTop: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(5),
    },
    alert: {
        marginTop: theme.spacing(3)
    }
}));

/**
 * Component to show, update user data
 * @returns {JSX.Element}
 * @constructor
 */
function About() {

    const classes = useStyles()
    const userId = useSelector(state => state.user._id)

    // Info redux
    const reduxName = useSelector(state => state.user.name)
    const reduxUsername = useSelector(state => state.user.username)
    const reduxEmail = useSelector(state => state.user.email)

    // State check
    const [checkName, setCheckName] = useState(false);
    const [checkUsername, setCheckUsername] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    // State text field
    const [disabledName, setDisabledName] = useState(true)
    const [disabledUsername, setDisabledUsername] = useState(true)
    const [disabledEmail, setDisabledEmail] = useState(true)

    // State error
    const [errorName, setErrorName] = useState(false)
    const [errorUsername, setErrorUsername] = useState({
        isError: false,
        text: ''
    })

    const [errorEmail, setErrorEmail] = useState({
        isError: false,
        text: ''
    })

    // State alert
    const [alertInfo, setAlertInfo] = useState({
        isError: false,
        text: ''
    })

    const [open, setOpen] = useState(false);

    const [name, setName] = useState(reduxName)
    const [username, setUsername] = useState(reduxUsername)
    const [email, setEmail] = useState(reduxEmail)

    /**
     * Action to check user data
     */
    const handleClickCheck = (event) => {
        switch (event.target.ariaLabel) {
            case 'Name':
                setCheckName(!checkName);
                setDisabledName(!disabledName)
                break;
            case 'Username':
                setCheckUsername(!checkUsername);
                setDisabledUsername(!disabledUsername)
                break;
            case 'Email':
                setCheckEmail(!checkEmail);
                setDisabledEmail(!disabledEmail)
                break;
            default:
                break;
        }
    };

    /**
     * Action to change name
     */
    const onChangeName = (event) => {
        setName(event.target.value)
    }

    /**
     * Action to change username
     */
    const onChangeUsername = (event) => {
        const {value} = event.target
        setUsername(value)
        request.isUserValid(value, false, userId).then(res => {
            if (!res) setErrorUsername({...errorUsername, isError: true, text: 'Username already present!'})
            else setErrorUsername({...errorUsername, isError: false, text: ''})
        }).catch((err) => setErrorUsername({...errorUsername, isError: true, text: err.response.data.message}))
    }

    /**
     * Action to change email
     */
    const onChangeEmail = (event) => {
        const {value} = event.target
        setEmail(value)
        request.isEmailFormatValid(value).then(res => {
            request.isEmailValid(value, false, userId).then((res) => {
                if (!res) setErrorEmail({...errorEmail, isError: true, text: 'Email is already present!'})
                else setErrorEmail({...errorEmail, isError: false, text: ''})
            })
        }).catch((err) => {
            setErrorEmail({...errorEmail, isError: true, text: err.response.data.message})
        })
    }

    /**
     * Action to submit
     */
    const onSubmit = event => {
        event.preventDefault()
        isValidForm(name, username, setErrorName, errorEmail, setErrorEmail, email)

        if (name && username && email && !errorEmail.isError && !errorUsername.isError) {
            request.updateUserData(userId, name, username, email).then((res) => {
                store.dispatch(changeData(res.data.data))
                setDisabledEmail(true)
                setDisabledUsername(true)
                setDisabledName(true)
                setCheckEmail(false)
                setCheckUsername(false)
                setCheckName(false)
                setAlertInfo({...alertInfo, text: res.data.message})
            }).catch((err) => {
                setAlertInfo({...alertInfo, text: err.response.data.message, isError: true})
            })
        }
    }

    const onOpenDialog = () => {
        setOpen(true);
    };

    const onDialogCancel = () => setOpen(false)

    /**
     * Action to click dialog
     */
    const onDialogDelete = () => {
        setOpen(false);
        request.deleteUser(userId).then(() => {
            store.dispatch(resetUser())
            store.dispatch(deleteToken())
            store.dispatch(resetNotice())
            store.dispatch(resetList())
            store.dispatch(setAlert({alert: 'Account deleted!', isSuccess: true}))
            history.push('/signIn')
        }).catch()

    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container justify={'center'} className={classes.contText}>
                        <Grid item xs>
                            <TextField
                                error={errorName}
                                helperText={errorName ? 'Name must not be empty' : ''}
                                autoComplete="fname"
                                name="name"
                                variant="standard"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                disabled={disabledName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChangeName}
                            />
                        </Grid>
                        <Checkbox
                            icon={<EditIcon/>}
                            checkedIcon={<Edit/>}
                            color={'primary'}
                            className={classes.check}
                            checked={checkName}
                            onClick={handleClickCheck}
                            inputProps={{'aria-label': 'Name'}}
                        />
                    </Grid>
                    <Grid container justify={'center'} className={classes.contText}>
                        <Grid item xs>
                            <TextField
                                autoComplete="fname"
                                name="name"
                                variant="standard"
                                required
                                fullWidth
                                id="name"
                                label="Username"
                                autoFocus
                                value={username}
                                disabled={disabledUsername}
                                error={errorUsername.isError}
                                helperText={errorUsername.isError ? errorUsername.text : false}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChangeUsername}
                            />
                        </Grid>
                        <Checkbox
                            icon={<EditIcon/>}
                            checkedIcon={<Edit/>}
                            color={'primary'}
                            className={classes.check}
                            checked={checkUsername}
                            onClick={handleClickCheck}
                            inputProps={{'aria-label': 'Username'}}
                        />
                    </Grid>
                    <Grid container justify={'center'} className={classes.contText}>
                        <Grid item xs>
                            <TextField
                                autoComplete="fname"
                                name="name"
                                variant="standard"
                                required
                                fullWidth
                                id="name"
                                label="Email"
                                autoFocus
                                value={email}
                                disabled={disabledEmail}
                                error={errorEmail.isError}
                                helperText={errorEmail.text}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChangeEmail}
                            />
                        </Grid>
                        <Checkbox
                            icon={<EditIcon/>}
                            checkedIcon={<Edit/>}
                            color={'primary'}
                            className={classes.check}
                            checked={checkEmail}
                            onClick={handleClickCheck}
                            inputProps={{'aria-label': 'Email'}}
                        />
                    </Grid>


                    <Grid container justify={'center'} className={classes.button} spacing={4}>
                        <Grid item>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                value={"submit"}
                                startIcon={<SaveIcon/>}
                            >
                                Save
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={onOpenDialog}
                                startIcon={<DeleteIcon/>}
                            >
                                Delete Account
                            </Button>
                        </Grid>
                        <Dialog
                            open={open}
                            onClose={onDialogCancel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Delete your account?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete the account?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onDialogCancel} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={onDialogDelete} color="primary" autoFocus>
                                    Ok, delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Grid container justify={'center'}>
                            {alertInfo.text &&
                            <Alert severity={alertInfo.isError ? 'error' : 'success'} variant="standard"
                                   className={classes.alert}>
                                {alertInfo.text}
                            </Alert>}
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default About

function isValidForm(name, username, setErrName, errorEmail, setErrorEmail, email) {
    setErrName(name === '')
    if (!errorEmail.isError) {
        setErrorEmail({...errorEmail, isError: email === '', text: email === '' ? 'Email must not be empty!' : ''})
    }
}
