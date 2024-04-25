import React from "react";
import {makeStyles} from "@mui/styles";
import clockImage from "../../assets/clock.png";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh",
        backgroundColor: "rgba(190,232,224,0.43)"
    },
    rotate: {
        animation: '$spin 20s linear infinite', // Referenca na definiranu animaciju dolje
    },
    '@keyframes spin': {
        '0%': {transform: 'rotate(0deg)'},
        '100%': {transform: 'rotate(360deg)'},
    },
});

export default function Loading() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src={clockImage} alt="loading" className={classes.rotate} width="100"/>
        </div>
    );
}