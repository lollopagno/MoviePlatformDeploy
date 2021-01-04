import {makeStyles} from "@material-ui/core/styles";

const VIOLA = "#8000ff"
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: VIOLA,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    marginFormControl: {
        marginTop: theme.spacing(2),
    },
    textFieldFormControl: {
        display: 'flex'
    },
    button:{
        marginTop : theme.spacing(2),
    },
    link:{
        marginTop : theme.spacing(4)
    },
    alert:{
        marginTop : theme.spacing(3)
    }
}));

export {useStyles}
