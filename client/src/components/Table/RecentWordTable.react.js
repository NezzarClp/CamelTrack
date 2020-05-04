import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import SpoilerText from '../Text/SpoilerText.react.js';

import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const getWordsByDay = (lowerDay, higherDay) => useQuery(gql`
    {
        getWords(lowerDay: ${lowerDay}, higherDay: ${higherDay}) {
            romaji
            word
            en
        }
    }
`, { fetchPolicy: 'no-cache' });

export default function RecentWordTable(props) {
    const { numDay, numLastDay } = props;

    let tableData;

    if (numDay && parseInt(numDay, 10) !== NaN) {
        const days = parseInt(numDay, 10);
        const { loading, error, data } = getWordsByDay(days, parseInt(numLastDay, 10));
        tableData = loading ? [<TableCell>...</TableCell>] : 
            (error ? [<TableCell>ERR</TableCell>] : 
            data.getWords.map(({ romaji, en, word }) => (
                <React.Fragment>
                    <TableCell>{word}</TableCell>
                    <TableCell><SpoilerText>{romaji}</SpoilerText></TableCell>
                    <TableCell><SpoilerText>{en}</SpoilerText></TableCell>
                </React.Fragment>
            )));
    } else {
        tableData = [];
    }

    const tableRows = tableData.map((data, index) => (
        <TableRow key={index}>
            {data} 
        </TableRow>
    ));

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Word</TableCell>
                        <TableCell>Romaji</TableCell>
                        <TableCell>English meaning</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableRows}                                
                </TableBody>
            </Table>
        </TableContainer>
    );
}
