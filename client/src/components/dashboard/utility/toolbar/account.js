import React, {useState} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {AccountCircle} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {store} from "../../../../redux/store";
import {resetUser} from "../../../../redux/reducer/userReducer";
import {deleteToken} from "../../../../redux/reducer/tokenReducer";
import history from "../../../../history";
import {setAlert} from "../../../../redux/reducer/signInReducer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {socket} from '../../../../requests/socket'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  account : {
      marginLeft: theme.spacing(1)
  }
}))

const sectionsLogin = [
    {id: 0, value: 'Account'},
    {id: 1, value: 'My Profile'},
    {id: 2, value: 'Logout'}
];

const ID_MY_PROFILE = '1'
const ID_LOG_OUT = '2'

/**
 * Component to show account button
 * @returns {JSX.Element}
 * @constructor
 */
function Account() {

    const classes = useStyles()

    // State for Menu item account
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [open, setOpen] = useState(false)

    const onClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

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
     * Action to click item menu
     * @param event
     * @param index
     */
    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);

        if (event.currentTarget.id === ID_MY_PROFILE) {
            history.push('/myProfile#favorite')
        } else if (event.currentTarget.id === ID_LOG_OUT) {
            onOpenDialog()
        }
    }

    return (
        <div>
            <IconButton edge={'end'} id="account" onClick={onClick} className={classes.account}>
                <AccountCircle style={{color: 'white'}}/>
            </IconButton>
            <Menu
                id="account"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {sectionsLogin.map((option, index) => (
                    <MenuItem
                        key={option.id}
                        id={option.id}
                        aria-label={sectionsLogin[0].value}
                        disabled={index === 0}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option.value}
                    </MenuItem>
                ))}
            </Menu>
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

export default Account;
