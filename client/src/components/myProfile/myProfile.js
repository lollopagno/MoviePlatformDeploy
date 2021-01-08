import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Home} from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, {useEffect, useState} from "react";
import history from '../../history'
import {store} from "../../redux/store";
import {resetUser} from "../../redux/reducer/userReducer";
import {deleteToken} from "../../redux/reducer/tokenReducer";
import {setAlert} from "../../redux/reducer/signInReducer";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Favorites from "./bottomBavigation/favorites";
import About from "./bottomBavigation/about";
import AddContents from "./bottomBavigation/addContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {socket} from "../../requests/socket";
import {eventNotice, resetNotice} from "../../redux/reducer/socketReducer";
import Notice from "../notice/notice";
import PaperComponent from "../notice/paper";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    bottomNavigation: {
        width: 500,
        marginTop: theme.spacing(3),
    },
    homeIcon: {
        marginLeft: theme.spacing(1)
    },
    divider: {
        marginTop: theme.spacing(3)
    },
    notice: {
        marginTop : theme.spacing(3)
    }
}));

/**
 * Component my profile
 * @returns {JSX.Element}
 * @constructor
 */
function MyProfile() {

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const name = useSelector(state => state.user.name)
    const noticeList = useSelector(state => state.socket.list)
    const notice = useSelector(state => state.socket.notice)
    const [isNotice, setIsNotice] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        socket.on('notice new content added', (data) => {
            store.dispatch(eventNotice(data))
        })

        return () => {
            socket.off('notice new content added');
        }
    },[])

    const paperNotice = (noticeList.length !== 0) ? noticeList.slice(0).reverse().map((item, index) =>
        <PaperComponent notice={item} index={index} key={item.id}/>) : []

    const onDialogCancel = () => setOpen(false)

    const onOpenDialog = () => {
        setOpen(true);
    };

    /**
     * Action to click dialog
     */
    const onDialogExit = () => {
        setOpen(false);
        store.dispatch(resetUser())
        store.dispatch(deleteToken())
        socket.disconnect()
        store.dispatch(setAlert({alert: 'Sign out completed!', isSuccess: true}))
        history.push('/signIn')
    };

    /**
     * Action to click home icon
     */
    const onClickHome = () => {
        history.push('/dashboard')
    }

    /**
     * Action to click notice icon
     */
    const onClickNotice = () => {
        setIsNotice(true)
        store.dispatch(resetNotice())
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        {"Hi " + name + ", "}
                    </Typography>
                    <IconButton id="account" onClick={onClickHome} className={classes.homeIcon}>
                        <Home style={{color: 'white'}}/>
                    </IconButton>
                    <IconButton aria-label="show 11 new notifications"
                                color="inherit" onClick={onClickNotice}>
                        <Badge badgeContent={notice} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton onClick={onOpenDialog}>
                        <MeetingRoomIcon style={{color: 'white'}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Grid container justify={'center'}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        setIsNotice(false)
                    }}
                    showLabels
                    className={classes.bottomNavigation}
                >
                    <BottomNavigationAction label="Favorites" icon={<FavoriteIcon/>} href={'#favoriteContent'}/>
                    <BottomNavigationAction label="Add contents" icon={<AddCircleOutlineIcon/>}
                                            href={'#addContent'}/>
                    <BottomNavigationAction label="About" icon={<AccountBoxIcon/>} href={'#about'}/>
                </BottomNavigation>

                <Grid container justify={'center'}>
                    <Grid item xs={6} className={classes.divider}>
                        <Divider/>
                    </Grid>
                </Grid>

                {!isNotice && value === 0 && <Favorites/>}
                {!isNotice && value === 1 && <AddContents/>}
                {!isNotice && value === 2 && <About/>}
                <Grid className={classes.notice}>
                    {isNotice && <Notice notices={paperNotice}/>}
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={onDialogCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Exit the application?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to quit?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDialogCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onDialogExit} color="primary" autoFocus>
                        Ok, exit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MyProfile;

