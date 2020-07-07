import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Button from '@material-ui/core/Button';

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


export default function CollectionView(props) {
    const classes = useStyles();
    const [file, setFile] = useState(null);

    const onButtonClick = async (event) => {
        console.log('cliecked');
    };

    return (
        <div className={classes.mainClass}>
            <div className={classes.title}> Collections </div>
            <input type="file" name="fileToUpload" id="fileToUpload" onChange={(event) => { setFile(event.target.files[0])}}/>
            
            <Button onClick={onButtonClick} variant="contained" color="primary">
                Submit
            </Button>
        </div>
    );
}
