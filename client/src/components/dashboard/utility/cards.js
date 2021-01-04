import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Markup} from 'interweave';
import Divider from "@material-ui/core/Divider";
import IMAGE_NOT_FOUND from '../../../resource/image_not_found.png'
import Alert from "@material-ui/lab/Alert";
import RatingContent from "./ratingContent";

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    alertContainer: {
        marginTop: theme.spacing(2),
    }
}));

/**
 * Component to show a single content in dashboard
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Cards(props) {

    const classes = useStyles();
    const collection = props.result.data

    const cards = collection.map(item =>
        <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card className={classes.card}>
                <CardMedia
                    component={'img'}
                    src={item.img !== null ? item.img : IMAGE_NOT_FOUND}
                    title={"Img" + item.title !== undefined ? item.title : item.name}
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2">
                        {item.title !== undefined ? item.title : item.name}
                    </Typography>
                    <Divider variant={"middle"}/><br/>
                    <Typography variant="body2" component="span">
                        {item.category !== undefined ? <Markup
                            content={"<strong>Category</strong>: " + item.category + "<br/>"}/> : ""}
                        {item.language !== undefined ? <Markup
                            content={"<strong>Language</strong>: " + item.language + "<br/>"}/> : ""}
                        {item.date !== undefined ? <Markup
                            content={"<strong>Release date</strong>: " + item.date + "<br/>"}/> : ""}
                        {item.vote !== undefined ?
                            <Markup content={"<strong>Vote</strong>: " + item.vote + "<br/>"}/> : ""}
                        {item.popularity !== undefined ? <Markup
                            content={"<strong>Popularity</strong>: " + item.popularity + "<br/>"}/> : ""}
                        {item.department !== undefined ? <Markup
                            content={"<strong>Department</strong>: " + item.department + "<br/>"}/> : ""}
                    </Typography>
                </CardContent>
                <Divider variant={"middle"}/>
                <RatingContent key={item._id} id={item._id}
                               category={item.category !== undefined ? item.category : props.category} value={item.rating}/>
            </Card>
        </Grid>
    )

    return (
        <Container maxWidth="md">
            <Grid container spacing={4}>
                {collection.length > 0 && cards}
                {collection.length === 0 && (
                    <Grid container justify={"center"} className={classes.alertContainer}>
                        <Grid item xs={6}>
                            <Alert variant="standard" severity="error">
                                The search did not give any results!
                            </Alert>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Container>
    )
}

export default Cards;
