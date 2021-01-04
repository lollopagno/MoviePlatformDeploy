import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Hidden from "@material-ui/core/Hidden";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import CheckIcon from "@material-ui/icons/Check";
import React, {useState} from "react";
import {requestMovies} from "../../../../requests/content/movies";
import Cards from "../cards";
import ErrorAPI from "../errorAPI";
import {requestTV} from "../../../../requests/content/tv";
import {requestActors} from "../../../../requests/content/actors";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {fade} from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchMobile: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 25,
        width: '20ch',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 'auto',
        },
    },
    checkIcon: {
        marginLeft: theme.spacing(1)
    },
    deleteIcon: {
        marginRight: theme.spacing(1)
    },
    dividerSearchBar: {
        margin: 0.5,
        height: 20,
    },
}))

const MOVIES = 'Movies'
const TV = 'TV'
const ACTORS = 'Actors'

/**
 * Component to manage search bar
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SearchBar(props) {

    const classes = useStyles()
    const id = useSelector(state => state.user._id)
    const [contentSearch, setContentSearch] = useState('')

    /**
     * Action to change text in search bar
     * @param event
     */
    const onChangeSearch = (event) => {
        setContentSearch(event.target.value)
    }

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            onClickSearch()
        }
    }

    /**
     * Action to submit
     */
    const onClickSearch = () => {
        setContentSearch('')
        switch (true) {

            case props.category.includes(MOVIES):
                props.setCategory("Search Movies: " + contentSearch)
                requestMovies.search(contentSearch, id).then((res) => {
                    props.setCards(<Cards result={res.data} category={MOVIES}/>)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                })
                break;

            case props.category.includes(TV):
                props.setCategory("Search TV programs: " + contentSearch)
                requestTV.search(contentSearch, id).then((res) => {
                    props.setCards(<Cards result={res.data} category={TV}/>)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                })
                break;

            case props.category.includes(ACTORS):
                props.setCategory("Search Actors: " + contentSearch)
                requestActors.search(contentSearch, id).then((res) => {
                    props.setCards(<Cards result={res.data} category={ACTORS}/>)
                }).catch((err) => {
                    props.setCards(<ErrorAPI msg={err.response.data.message}/>)
                })
                break;

            default:
                break;
        }
    }

    /**
     * Action to click delete icon
     */
    const onClickDeleteIcon = () => {
        setContentSearch('')
    }

    return (
        <div>
            <Hidden xsDown implementation="css">
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder={props.category.includes(MOVIES) ? 'Search movies' : props.category.includes(TV) ? 'Search tv programs' : 'Search actors'}
                        classes={{root: classes.inputRoot, input: classes.inputInput}}
                        onChange={onChangeSearch}
                        onKeyDown={onKeyDown}
                        value={contentSearch}
                        inputProps={{'aria-label': 'search '}}
                        endAdornment={
                            <InputAdornment position={'end'}>
                                <IconButton size="small" className={classes.deleteIcon}
                                            onClick={onClickDeleteIcon}
                                            color={'inherit'}>
                                    <ClearIcon/>
                                </IconButton>
                                <Paper>
                                    <Divider orientation="vertical" className={classes.dividerSearchBar}/>
                                </Paper>
                                <IconButton size="small" className={classes.checkIcon} onClick={onClickSearch}
                                            color={'inherit'}>
                                    <CheckIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>
            </Hidden>
            <Hidden smUp implementation="css">
                <div className={classes.searchMobile}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder={props.category.includes(MOVIES) ? 'Search movies' : props.category.includes(TV) ? 'Search tv programs' : 'Search actors'}
                        classes={{root: classes.inputRoot, input: classes.inputInput}}
                        onChange={onChangeSearch}
                        onKeyDown={onKeyDown}
                        value={contentSearch}
                        inputProps={{'aria-label': 'search '}}
                    />
                </div>
            </Hidden>
        </div>
    )
}

export default SearchBar;
