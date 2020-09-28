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
    text: {
        fontSize: '12px',
        fontWeight: '200',
        lineHeight: '18px',
    },
});

export default function MiscView(props) {
    const classes = useStyles();
    const [file, setFile] = useState(null);
    const [serverResponse, setServerResponse] = useState('');

    const onButtonClick = async (event) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('https://142.93.195.94/api/collection', formData);
 
        if (res.error) {
            setServerResponse('Error...');
        } else {
            setServerResponse(res.data.name);
        }
    };

    return (
        <div className={classes.mainClass}>
            <div className={classes.title}> Misc </div>
            <input type="file" name="fileToUpload" id="fileToUpload" onChange={(event) => { setFile(event.target.files[0])}}/>
            <Button onClick={onButtonClick} variant="contained" color="primary">
                Submit
            </Button>
            <div className={classes.text}> {serverResponse} </div>
        </div>
    );
}
