import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TitleIcon from '@material-ui/icons/Title';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import LanguageIcon from '@material-ui/icons/Language';
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import {Alert} from "@material-ui/lab";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import {requestNewContents} from "../../../../requests/content/newContents";
import {useSelector} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {socket} from "../../../../requests/socket";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
    },
    formControl: {
        margin: theme.spacing(1),
    },
    contText: {
        marginTop: theme.spacing(1)
    },
    input: {
        display: 'none',
    },
    alertImage: {
        marginTop: theme.spacing(3),
    },
    alertInfo: {
        marginTop: theme.spacing(3),
    },
    button: {
        marginTop: theme.spacing(4),
    },
}));

/**
 * Component to added movies / tv content
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function MoviesTvContents(props) {

    const classes = useStyles()
    const userId = useSelector(state => state.user._id)
    const username = useSelector(state => state.user.username)

    // State select
    const [valueSelect, setValueSelect] = useState('1');
    const [openSelect, setOpenSelect] = useState(false);

    // State contents
    const [field, setField] = useState({
        title: '',
        date: '',
        language: '',
        vote: '',
        section: 'Popular',
        image: null
    })

    const [error, setError] = useState({
        title: false,
        date: false,
        language: false,
        vote: false,
        image: false
    })

    const [alertImage, setAlertImage] = useState({
        text: '',
        isError: false
    })

    const [alert, setAlert] = useState({
        text: '',
        isError: false
    })

    /**
     * Action to click select
     */
    const onChangeSelect = (event) => {
        const {value} = event.target
        setValueSelect(value);
        if (value === 1) {
            setField({...field, section: 'Popular'})
        } else if (value === 2) {
            setField({...field, section: 'Top rated'})
        } else {
            setField({...field, section: 'Upcoming'})
        }
    };

    const onCloseSelect = () => {
        setOpenSelect(false);
    };

    const onOpenSelect = () => {
        setOpenSelect(true);
    };

    const onChange = (event) => {
        const {name, value} = event.target
        setField({...field, [name]: value})
    }

    /**
     * Action to added image
     */
    const onImageChange = (event) => {
        if (event.target.files[0]) {
            setField({...field, image: event.target.files[0]})
            setAlertImage({...alertImage, isError: false, text: 'Image loaded correctly!'})
            setAlert({...alert, isError: false, text: ''})
        }
    }

    const completeRequest = (result) => {
        setAlertImage({...alertImage, isError: false, text: ''})
        setAlert({...alert, isError: false, text: result.data.message})
        setField({...field, title: '', date: '', section: '', vote: '', language: '', image: null})
        const data = {
            id: result.data.data._id,
            title: result.data.data.title,
            category: result.data.data.category,
            username: username
        }
        socket.emit('new content added', data)
    }

    /**
     * Action to submit
     */
    const onSubmit = (event) => {
        event.preventDefault()
        isValidForm(error, setError, field, alert, setAlert)

        if (field.title && field.date && field.language && parseFloat(field.vote) <= 10 && parseFloat(field.vote) >= 0) {
            requestNewContents.addData(userId, field, props.category).then((res) => {
                setValueSelect('1')
                // Upload image
                if (field.image !== null) {
                    requestNewContents.addImage(res.data.data._id, field.image).then((res) => {
                        completeRequest(res)
                    }).catch(err => {
                        setAlert({...alert, isError: true, text: err.response.data.message})
                    })
                } else {
                    completeRequest(res)
                }
            }).catch(err => {
                setAlertImage({...alertImage, isError: false, text: ''})
                setAlert({...alert, isError: true, text: err.response.data.message})
            })
        }
    }

    return (
        <Grid container justify={'center'}>
            <form noValidate className={classes.form} onSubmit={onSubmit}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={openSelect}
                        onClose={onCloseSelect}
                        onOpen={onOpenSelect}
                        value={valueSelect}
                        onChange={onChangeSelect}
                    >
                        {(props.category === 'Movies' || props.category === 'TV') &&
                        <MenuItem value={1}>Popular</MenuItem>}
                        {(props.category === 'Movies' || props.category === 'TV') &&
                        <MenuItem value={2}>Top Rated</MenuItem>}
                        {props.category === 'Movies' && <MenuItem value={3}>Upcoming</MenuItem>}
                    </Select>
                    <Grid container spacing={2} className={classes.contText}>
                        <Grid item xs={12}>
                            <TextField
                                error={error.title}
                                helperText={error.title ? 'Title must not be empty' : ''}
                                autoComplete="ftitle"
                                name="title"
                                variant="standard"
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                autoFocus
                                value={field.title}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TitleIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error.date}
                                helperText={error.date ? 'Release date must not be empty' : ''}
                                type={"date"}
                                autoComplete="freleaseDate"
                                name="date"
                                variant="standard"
                                required
                                fullWidth
                                id="releaseDate"
                                label="Release Date"
                                autoFocus
                                value={field.date}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error.language}
                                helperText={error.language ? 'Language must not be empty' : ''}
                                autoComplete="flanguage"
                                name="language"
                                variant="standard"
                                required
                                fullWidth
                                id="language"
                                label="Language"
                                autoFocus
                                value={field.language}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LanguageIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error.vote}
                                helperText={error.vote ? 'Vote must not be empty and not greater than 10' : ''}
                                autoComplete="fvote"
                                type={"number"}
                                name="vote"
                                variant="standard"
                                required
                                fullWidth
                                id="vote"
                                label="Vote"
                                autoFocus
                                value={field.vote}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ThumbUpIcon/>
                                        </InputAdornment>
                                    ), inputProps: {min: 0, max: 10, step: 0.1}
                                }}
                                onChange={onChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify={'center'} spacing={2}>
                        <Grid item>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={onImageChange}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span" className={classes.button}
                                        startIcon={<CameraAltIcon/>}>
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                        {alertImage.text &&
                        <Grid item>
                            <Alert severity={alertImage.isError ? 'error' : 'success'} className={classes.alertImage}
                                   variant="standard">
                                {alertImage.text}
                            </Alert>
                        </Grid>}
                    </Grid>
                    <Grid container justify={'center'}>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                value={"submit"}
                                startIcon={<SaveIcon/>}
                            >
                                Save
                            </Button>
                        </Grid>
                        {alert.text &&
                        <Alert severity={alert.isError ? 'error' : 'success'} className={classes.alertInfo}
                               variant="standard">
                            {alert.text}
                        </Alert>}
                    </Grid>
                </FormControl>
            </form>
        </Grid>
    )
}

export default MoviesTvContents;


function isValidForm(error, setError, field, alert, setAlert) {
    setError({
        ...error,
        title: field.title === '',
        date: field.date === '',
        language: field.language === '',
        vote: (field.vote === '' || (parseFloat(field.vote) > 10 || parseFloat(field.vote) < 0)),
        image: field.image === null
    })
    setAlert({
        ...alert,
        isError: (!(field.title === '' || field.date === '' || field.language === '' || (field.vote === '' || (parseFloat(field.vote) > 10 || parseFloat(field.vote) < 0)))),
        text: ''
    })
}
