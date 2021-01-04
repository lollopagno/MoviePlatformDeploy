import React, {useState} from 'react'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MoviesTvContents from "./categotyContent/moviesTv";
import Actors from "./categotyContent/actors";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}));

/**
 * Component to added new contents
 * @returns {JSX.Element}
 * @constructor
 */
function AddContents() {

    const classes = useStyles()
    const [valueSelect, setValueSelect] = useState('');
    const [openSelect, setOpenSelect] = useState(false);

    /**
     * Action to click select
     */
    const onChangeSelect = (event) => {
        setValueSelect(event.target.value);
    };

    const onCloseSelect = () => {
        setOpenSelect(false);
    };

    const onOpenSelect = () => {
        setOpenSelect(true);
    };

    return (
        <Container component="main" maxWidth="xs">
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openSelect}
                    onClose={onCloseSelect}
                    onOpen={onOpenSelect}
                    value={valueSelect}
                    onChange={onChangeSelect}
                >
                    <MenuItem value={1}>Movies</MenuItem>
                    <MenuItem value={2}>Tv programs</MenuItem>
                    <MenuItem value={3}>Actors</MenuItem>
                </Select>
            </FormControl>
            {valueSelect === 1 && <MoviesTvContents category={'Movies'}/>}
            {valueSelect === 2 && <MoviesTvContents category={'TV'}/>}
            {valueSelect === 3 && <Actors category={'Actors'}/>}
        </Container>
    )
}

export default AddContents
