import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    mainClass: {
        width: '100%',
        height: '100%',
        margin: '10px',
    },
    title: {
        fontSize: '18px',
        fontWeight: '300',
        lineHeight: '30px',
    },
});

export default function MiscView(props) {
    const classes = useStyles();

    return (
        <div className={classes.mainClass}>
            <div className={classes.title}> RecentWords </div>
            <input type="file" name="fileToUpload" id="fileToUpload" />
        </div>
    );
}
