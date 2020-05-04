import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    hidden: {
        width: '100%',
        borderRadius: '3px',
        backgroundColor: 'black',
    },
    hiddenInner: {
        opacity: 0,
    },
});

export default function SpoilerText(props) {
    const classes = useStyles();
    const [toggled, setToggled] = useState(false);
    const toggleClassName = toggled ? '' : classes.hidden;
    const innerClassName = toggled ? '' : classes.hiddenInner;
    const onSpoilerClick = (event) => { setToggled(true); }

    return (
        <div className={toggleClassName} onClick={onSpoilerClick}>
            <div className={innerClassName}>
                {props.children}
            </div>
        </div>
    );
}

