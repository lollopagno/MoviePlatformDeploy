import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {store} from "../../redux/store";
import {resetList} from "../../redux/reducer/socketReducer";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(5),
        marginDown: theme.spacing(4)
    }
}));

/**
 * Component notice
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Notice(props) {

    const classes = useStyles();

    const deleteNotice = () => {
        store.dispatch(resetList())
    }

    return (
        <div className={classes.root}>
            {props.notices.length > 0 &&
            <Container component="main" maxWidth="xs">
                {props.notices}
                <Grid container justify={'center'}>
                    <Grid item xs={6}>
                        <Button
                            className={classes.button}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={deleteNotice}
                        >
                            Delete all
                        </Button>
                    </Grid>
                </Grid>
            </Container>}
            {props.notices.length === 0 &&
            <Grid container justify={'center'}>
                <Alert variant="standard" severity="warning">
                    There aren't notifications at this time.
                </Alert>
            </Grid>}
        </div>
    )
}

export default Notice;
