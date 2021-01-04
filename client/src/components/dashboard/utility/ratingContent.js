import React, {useState} from "react";
import {requestRating} from "../../../requests/content/rating";
import {useSelector} from "react-redux";
import CardActions from "@material-ui/core/CardActions";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from '@material-ui/icons/StarBorder'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    cardAction: {
        display: 'flex',
        alignItems: 'center'
    }
}));

/**
 * Component to rate a content
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function RatingContent(props) {

    const classes = useStyles()
    const [value, setValue] = useState(props.value);
    const userId = useSelector(state => state.user._id)

    /**
     * Action to change rate
     * @param event
     */
    const onChangeFavorites = (event) => {

        const contentId = event.currentTarget.name.split("-")[0]
        const category = event.currentTarget.name.split("-")[1]
        setValue(event.currentTarget.value)

        requestRating.update(contentId, userId, category, event.currentTarget.value).then(() => {
        }).catch(err => {
            console.log(err.response.data.message)
        })
    }

    return (
        <Grid container justify={'center'}>
            <CardActions className={classes.cardAction}>
                <Rating
                    name={props.id + "-" + props.category}
                    defaultValue={0}
                    value={parseInt(value)}
                    precision={1}
                    onChange={onChangeFavorites}
                    emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                />
            </CardActions>
        </Grid>
    )
}

export default RatingContent;
