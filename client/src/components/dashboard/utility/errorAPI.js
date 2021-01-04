import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import {Container} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    alertContainer: {
        paddingTop: theme.spacing(3)
    }
}));

/**
 * Component to show error message
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ErrorAPI(props) {

    const classes = useStyles()

    return (
        <Container className={classes.alertContainer} maxWidth="md">
            <Grid container justify={'center'} spacing={4}>
                <Grid item xs={6}>
                    <Alert variant="standard" severity="error">
                        {props.msg}
                    </Alert>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ErrorAPI;
