import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import WordTable from '../components/Table/WordTable.react.js';

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

const GET_NUM = gql`
    {
        numWords
    }
`;

const GET_QUESTION = gql`
    {
        getQuestions {
            result
        }
    }
`;

const getNumRanged = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const currentDate = Math.floor(Math.floor(currentTimestamp / (60 * 60 * 24)));
    const dateBefore = currentDate - 7;
    const lowTimestamp = dateBefore * (60 * 60 * 24);

    return gql`
        {
            numUpdatedWords(lowTimestamp: ${lowTimestamp}, highTimestamp: ${currentTimestamp})
        }
    `;
}

function getQuestionText({ loading, error, data }) {
    if (loading) {
        return '...';
    } else if (error) {
        return 'ERR';
    } else {
        const len = data.getQuestions.length;
        const trueCount = data.getQuestions.reduce((accum, record) => (accum + (record.result === "true" ? 1 : 0)), 0);
        const falseCount = data.getQuestions.reduce((accum, record) => (accum + (record.result === "false" ? 1 : 0)), 0);
        const percent = trueCount / len * 100;

        return `${trueCount} / ${len} (${percent.toFixed(2)}%)`;
    }
}

export default function DiscordBotView(props) {
    const classes = useStyles();
    const { loading: numLoading, error: numError, data: numData } = useQuery(GET_NUM, { pollInterval: 4000 });
    const { loading: dateLoading, error: dateError, data: dateData } = useQuery(getNumRanged());
    const questionQuery = useQuery(GET_QUESTION);
    const text = (numLoading ? '...' : (numError ? 'ERR' : numData.numWords));
    const text2 = (dateLoading ? '...' : (dateError ? 'ERR' : dateData.numUpdatedWords));
    const questionText = getQuestionText(questionQuery);

    return (
        <div className={classes.mainClass}>
            <div className={classes.title}> Dashboard </div>
            <Grid container spacing={2}>
                <Grid item container xs={12} spacing={3}>
                    <Grid item xs={4}>
                        <Paper className={classes.paper} elevation={3}>
                            <div className={classes.paperContainer}>
                                <div className={classes.subText}>Number of words:</div>
                                <h3 className={classes.mainText}>{text}</h3>
                            </div>
                        </Paper>
                        <Paper className={classes.paper} elevation={3}>
                            <div className={classes.paperContainer}>
                                <div className={classes.subText}>Number of recent words (in 7 days):</div>
                                <h3 className={classes.mainText}>{text2}</h3>
                            </div>
                        </Paper>
                        <Paper className={classes.paper} elevation={3}>
                            <div className={classes.paperContainer}>
                                <div className={classes.subText}>Questions</div>
                                <h3 className={classes.mainText}>{questionText}</h3>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={3}>
                    <Grid item xs={6}>
                        <WordTable />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
