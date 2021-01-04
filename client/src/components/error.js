import React from "react";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Alert} from "@material-ui/lab";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(25),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    title: {
        marginTop: theme.spacing(2),
        color: "#909090"
    },
    alert: {
        marginTop: theme.spacing(4),
    }
}));

/**
 * Error component - page not found
 * @returns {JSX.Element}
 * @constructor
 */
function Error() {

    const classes = useStyles()
    return (
        <Container component="main" maxWidth="xs">
            <Grid container justify={'center'} className={classes.root}>
                <Grid item>
                    <Typography variant={'h1'}>404</Typography>
                </Grid>
                <Grid item>
                    <Typography className={classes.title} variant={"h4"}>Page not found!</Typography>
                </Grid>
                <Grid item>
                    <Alert severity={'error'} variant="standard" className={classes.alert}>
                        We can't find the page you're looking for.<br/>You can either return to the previous page.
                    </Alert>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Error;
