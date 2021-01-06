import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, {useState} from "react";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {requestRating} from "../../../requests/content/rating";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import Cards from "../../dashboard/utility/cards";
import {Alert} from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Hidden from "@material-ui/core/Hidden";

const useStyles = makeStyles((theme) => ({
    switchContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    alert: {
        marginTop: theme.spacing(2)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    searchButton: {
        marginTop: theme.spacing(3)
    },
}));

/**
 * Component to show favorite contents
 * @returns {JSX.Element}
 * @constructor
 */
function Favorites() {

    const classes = useStyles()
    const id = useSelector(state => state.user._id)
    const [state, setState] = useState({
        movies: false,
        tvs: false,
        actors: false
    });
    const [cards, setCards] = useState([])
    const [alert, setAlert] = useState(null)
    const [backDrop, setBackdrop] = useState(false)

    const onChangeSwitch = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };

    /**
     * Action to click search switch
     */
    const onClickSearch = () => {
        setBackdrop(true)
        requestRating.search(id, state.movies, state.tvs, state.actors).then((res) => {
            setAlert(null)
            setCards(<Cards result={res.data}/>)
            setBackdrop(false)
        }).catch(err => {
            setCards([])
            setAlert(err.response.data.message)
            setBackdrop(false)
        })
    }

    return (
        <div>
            <Grid container justify={'center'} className={classes.switchContainer}>
                <FormGroup row>
                    <FormControlLabel
                        control={<Switch size="small" checked={state.movies} onChange={onChangeSwitch} name="movies"/>}
                        label="Movies"
                    />
                    <FormControlLabel
                        control={<Switch size="small" checked={state.tvs} onChange={onChangeSwitch} name="tvs"/>}
                        label="TV programs"
                    />
                    <FormControlLabel
                        control={<Switch size="small" checked={state.actors} onChange={onChangeSwitch} name="actors"/>}
                        label="Actors"
                    />
                </FormGroup>
                <Hidden xsDown implementation="css">
                    <Button
                        variant="contained"
                        color="default"
                        onClick={onClickSearch}
                        startIcon={<SearchIcon/>}
                    >
                        Search
                    </Button>
                </Hidden>
                <Hidden smUp implementation="css">
                    <Button
                        className={classes.searchButton}
                        variant="contained"
                        color="default"
                        onClick={onClickSearch}
                        startIcon={<SearchIcon/>}
                    >
                        Search
                    </Button>
                </Hidden>
            </Grid>
            <Backdrop className={classes.backdrop} open={backDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {cards}
            {alert && <Grid container justify={'center'}>
                <Alert severity={'error'} variant="standard" className={classes.alert}>
                    {alert}
                </Alert>
            </Grid>}
        </div>
    )
}

export default Favorites
