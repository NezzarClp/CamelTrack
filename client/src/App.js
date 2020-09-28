import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

import CollectionView from './views/CollectionView.react.js';
import DiscordBotView from './views/DiscordBotView.react.js'; 
import MiscView from './views/MiscView.react.js';
import RecentWordView from './views/RecentWordView.react.js';
import DashboardSidebar from './components/Sidebar/DashboardSidebar.react.js';

import useLocalStorage from './hooks/useLocalStorage';

const useStyles = makeStyles({
    appRoot: {
        display: 'flex', 
        backgroundColor: '#EEEEEE',
    },
});

const views = {
    'Master': DiscordBotView,
    'Recent word': RecentWordView,
    'Misc': MiscView,
    // 'Collection': CollectionView,
};

function App() {
    const classes = useStyles();
    const [subPage, setSubPage] = useLocalStorage('selectedSubPage', 'Master');
    const options = Object.keys(views);

    const View = views[subPage] || null;

    return (
        <div className={classes.appRoot} >
            <DashboardSidebar
                onChangeSubPage={(subPage) => { setSubPage(subPage) }}
                options={options}
                currentSubPage={subPage}
            />
            {View ? <View /> : null}
        </div>
    );
}

export default App;
