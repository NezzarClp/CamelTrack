import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import RecentWordTable from '../components/Table/RecentWordTable.react.js';

import useLocalStorage from '../hooks/useLocalStorage';

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
    const [numDay, setNumDay] = useLocalStorage('numDay', '');
    const [numLastDay, setNumLastDay] = useLocalStorage('numLastDay', '');
    const [usedDay, setUsedDay] = useState(numDay);
    const [usedLastDay, setUsedLastDay] = useState(numLastDay);
    const [hideOptions, setHideOptions] = useLocalStorage('hideOptions', ['word', 'en']);

    const handleHideOptions = (event, newOptions) => {
        setHideOptions(newOptions);
    };
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
                    <ToggleButtonGroup value={hideOptions} onChange={handleHideOptions} aria-label="text formatting">
                        <ToggleButton value="word" aria-label="bold">
                            Kanji
                        </ToggleButton>
                        <ToggleButton value="en" aria-label="italic">
                            English meaning
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item container xs={12} spacing={3}>
                    <Grid item xs={6}>
                        <RecentWordTable hideOptions={hideOptions} numDay={usedDay} numLastDay={usedLastDay} />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
