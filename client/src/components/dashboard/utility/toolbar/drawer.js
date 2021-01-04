import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TheatersIcon from "@material-ui/icons/Theaters";
import GradeIcon from "@material-ui/icons/Grade";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import ListItemText from "@material-ui/core/ListItemText";
import {AccountCircle} from "@material-ui/icons";
import React from "react";
import Hidden from "@material-ui/core/Hidden";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {requestMovies} from "../../../../requests/content/movies";
import Cards from "../cards";
import ErrorAPI from "../errorAPI";
import {useSelector} from "react-redux";
import {requestTV} from "../../../../requests/content/tv";
import {requestActors} from "../../../../requests/content/actors";
import history from "../../../../history";
import {store} from "../../../../redux/store";
import {resetUser} from "../../../../redux/reducer/userReducer";
import {deleteToken} from "../../../../redux/reducer/tokenReducer";
import {setAlert} from "../../../../redux/reducer/signInReducer";
import {socket} from "../../../../requests/socket";
import makeStyles from "@material-ui/core/styles/makeStyles";

const MOVIES = 'Movies'
const TV = 'TV'
const ACTORS = 'Actors'

const POPULAR = 'Popular'
const TOP_RATED = 'Top rated'
const UPCOMING = 'Upcoming'

const LOGOUT = 'Logout'
const MY_PROFILE = 'My profile'

const useStyles = makeStyles((theme) => ({
    tv: {
        marginRight: theme.spacing(2),
    }
}));

/**
 * Component to show drawer menu
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function DrawerComponent(props) {

    const classes = useStyles()
    const id = useSelector(state => state.user._id)

    /**
     * Action to click category film
     * @param event
     */
    const onClickFilm = (event) => {
        props.setBackDrop(true)
        props.isCards(true)
        switch (event.currentTarget.id) {
            case(POPULAR):
                props.category(MOVIES + " " + POPULAR)
                requestMovies.popular(id).then(res => {
                    props.setCards(<Cards result={res.data} category={MOVIES}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            case(TOP_RATED):
                props.category(MOVIES + " " + TOP_RATED)
                requestMovies.topRated(id).then(res => {
                    props.setCards(<Cards result={res.data} category={MOVIES}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            case(UPCOMING):
                props.category(MOVIES + " " + UPCOMING)
                requestMovies.upcoming(id).then(res => {
                    props.setCards(<Cards result={res.data} category={MOVIES}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            default:
                break
        }
    }

    /**
     * Action to click category program tv
     * @param event
     */
    const onClickTv = (event) => {
        props.setBackDrop(true)
        props.isCards(true)
        switch (event.currentTarget.id) {

            case(POPULAR):
                props.category(TV + " " + POPULAR)
                requestTV.popular(id).then(res => {
                    props.setCards(<Cards result={res.data} category={TV}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            case(TOP_RATED):
                props.category(TV + " " + TOP_RATED)
                requestTV.topRated(id).then(res => {
                    props.setCards(<Cards result={res.data} category={TV}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            default:
                break;
        }
    }

    /**
     * Action to click category actor
     * @param event
     */
    const onClickActors = (event) => {
        props.setBackDrop(true)
        props.isCards(true)
        switch (event.currentTarget.id) {

            case(POPULAR):
                props.category(ACTORS + " " + POPULAR)
                requestActors.popular(id).then(res => {
                    props.setCards(<Cards result={res.data} category={ACTORS}/>)
                    props.setBackDrop(false)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                    props.setBackDrop(false)
                })
                break;

            default:
                break;
        }
    }

    /**
     * Action to click account button
     * @param event
     */
    const onClickAccount = (event) => {
        props.isCards(true)
        switch (event.currentTarget.id) {
            case(MY_PROFILE):
                history.push('/myProfile#favorite')
                break;

            case(LOGOUT):
                store.dispatch(resetUser())
                store.dispatch(deleteToken())
                socket.disconnect()
                store.dispatch(setAlert({alert: 'Sign out completed!', isSuccess: true}))
                history.push('/signIn')
                break;

            default:
                break;
        }
    }

    return (
        <div>
            <Divider/>
            <br/>
            <Typography>Movies</Typography>
            <List>
                {['Popular', 'Top rated', 'Upcoming'].map((text, index) => (
                    <ListItem button id={text} onClick={onClickFilm} key={text}>
                        <ListItemIcon>{index === 0 ? <TheatersIcon/> : index === 1 ? <GradeIcon/> :
                            <FiberNewIcon/>}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <br/>
            <Hidden xsDown implementation="css">
            <Typography className={classes.tv}>Tv</Typography>
            </Hidden>
            <Hidden smUp implementation="css">
                <Typography>Tv</Typography>
            </Hidden>
            <List>
                {['Popular', 'Top rated'].map((text, index) => (
                    <ListItem button id={text} onClick={onClickTv} key={text}>
                        <ListItemIcon>{index === 0 ? <TheatersIcon/> : <GradeIcon/>}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <br/>
            <Typography>Actors</Typography>
            <List>
                <ListItem button id={'Popular'} onClick={onClickActors} key={'Popular'}>
                    <ListItemIcon><TheatersIcon/></ListItemIcon>
                    <ListItemText primary={'Popular'}/>
                </ListItem>
            </List>
            <Hidden smUp implementation="css">
                <Divider/>
                <br/>
                <Typography>User</Typography>
                <List>
                    {['My profile', 'Logout'].map((text, index) => (
                        <ListItem button id={text} onClick={onClickAccount} key={text}>
                            <ListItemIcon>{index === 0 ? <AccountCircle/> : <MeetingRoomIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </Hidden>
        </div>
    )
}

export default DrawerComponent
