import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import RecentWordTable from '../components/Table/RecentWordTable.react.js';

const useStyles = makeStyles({
    paper: {
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
        borderRadius: '6px',
    },
    mainClass: {
        width: '100%',
        height: '100%',
        margin: '10px',
    },
    paperContainer: {
        textAlign: 'right',
        padding: '10px',
    },
    mainText: {
        fontWeight: '300',
        margin: '0',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    title: {
        fontSize: '18px',
        fontWeight: '300',
        lineHeight: '30px',
    },
});

export default function RecentWordView(props) {
    const classes = useStyles();
    const [numDay, setNumDay] = useState('');
    const [numLastDay, setNumLastDay] = useState('0');
    const [usedDay, setUsedDay] = useState('');
    const [usedLastDay, setUsedLastDay] = useState('');

    const onButtonClick = (event) => {
        setUsedDay(numDay);
        setUsedLastDay(numLastDay);
    };

    return (
        <div className={classes.mainClass}>
            <div className={classes.title}> RecentWords </div>
            <Grid container spacing={2}>
                <Grid item container xs={12} spacing={3}>
                    <Grid item xs={2}>
                        <TextField
                            label="Number of days"
                            value={numDay}
                            onChange={(event) => { setNumDay(event.target.value); }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Number of last days"
                            value={numLastDay}
                            onChange={(event) => { setNumLastDay(event.target.value); }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={onButtonClick} variant="contained" color="primary">
                            UPDATE
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={3}>
                    <Grid item xs={6}>
                        <RecentWordTable numDay={usedDay} numLastDay={usedLastDay} />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
