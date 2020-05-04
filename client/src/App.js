import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

import DiscordBotView from './views/DiscordBotView.react.js'; 
import MiscView from './views/MiscView.react.js';
import RecentWordView from './views/RecentWordView.react.js';
import DashboardSidebar from './components/Sidebar/DashboardSidebar.react.js';

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
};

function App() {
    const classes = useStyles();
    const [subPage, setSubPage] = useState('Master');
    const options = ['Master', 'Recent word', 'Misc'];
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
