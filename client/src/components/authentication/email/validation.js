import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {authentication} from "../../../requests/authentication";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import history from "../../../history";
import {ButtonResendEmail} from "./funtionality";
import {Alert} from '@material-ui/lab';
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(15),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    container: {
        marginTop: theme.spacing(1)
    }
}))

/**
 * Component to show information if the email is verified
 * @returns {JSX.Element}
 * @constructor
 */
function ValidateEmail() {

    const classes = useStyles();

    const token = useSelector(state => state.token.email)
    const username = useSelector(state => state.user.username)

    const [infoValidation, setInfoValidation] = useState('')
    const [alert, setAlert] = useState({
        state: true
    })

    const params = {
        token: token,
        username: username
    }

    useEffect(() => {
        authentication.tokenEmail(params).then((res) => {
            setInfoValidation(res.data.message)
            setAlert({...alert, state: true})
        }).catch(err => {
            setInfoValidation(err.response.data.message)
            setAlert({...alert, state: false})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const signIn = (
        <Button
            type="submit"
            variant="contained"
            color="primary"
            value="submit"
            onClick={() => {
                history.push('/signIn')
            }}
        >
            Sign In
        </Button>
    )

    return (
        <Container component="main" maxWidth="xs">
            <Grid container justify={"center"} className={classes.root}>
                <Alert severity={alert.state ? 'success' : 'error'} variant="standard">
                    {infoValidation}
                </Alert>
                <Grid container spacing={3} justify={"center"} className={classes.container}>
                    {alert.state &&
                    <Grid item xs>
                        {signIn}
                    </Grid>}
                </Grid>
                {!alert.state &&
                <Grid item xs>
                    <ButtonResendEmail/>
                </Grid>}
            </Grid>
        </Container>
    )
}

export default ValidateEmail;
