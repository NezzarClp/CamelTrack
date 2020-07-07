import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
    paperAnchorLeft: {
        backgroundColor: '#232628',
        padding: '20px 10px 0 10px',
    },
    drawerRoot: {
        width: '191px',
        height: '100vh',
    },
    button: {
        borderRadius: '3px', 
        width: '170px',
        padding: '10px 15px',
    },
    selectedButton: {
        backgroundColor: '#00ACC1 !important',
    },
    text: {
        color: 'white',
        fontSize: '14px',
        margin: 'auto 10px',
        lineHeight: '300px',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function generateListItems(options, currentSubPage, onChangeSubPage, classes) {
    return (
        options.map((option) => {
            return (
                <ListItem
                    button
                    selected={option === currentSubPage}
                    key={option}
                    className={classes.button}
                    classes={{
                        selected: classes.selectedButton,
                    }}
                    onClick={(event) => { onChangeSubPage(option); }}
                >
                    <ListItemText className={classes.text}  primary={option} />
                </ListItem>
            );
        })
    );
}

export default function DashboardSidebar(props) {
    const { options, currentSubPage, onChangeSubPage } = props;
    const classes = useStyles();

    const listItems = generateListItems(options, currentSubPage, onChangeSubPage, classes);

    return (
        <Drawer
            anchor="left"
            variant="permanent"
            classes={{ root: classes.drawerRoot, paperAnchorLeft: classes.paperAnchorLeft }}
        >
            <List>
                {listItems}
            </List>
        </Drawer> 
    );
};
