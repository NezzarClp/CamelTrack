import React, { useState, useEffect } from 'react';
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

const useQueryWordsByDay = (lowerDay, higherDay, skip) => useQuery(gql`
    {
        getWords(lowerDay: ${lowerDay}, higherDay: ${higherDay}) {
            romaji
            word
            en
        }
    }
`, { fetchPolicy: 'no-cache', skip });

function getDisplayField(hideOptions) {
    if (!hideOptions.includes('en')) {
        return 'word';
    } else if (!hideOptions.includes('word')) {
        return 'en';
    } else {
        const check = Math.random() * 2;
        return check >= 1 ? 'en' : 'word';
    }
}

function getTableData(loading, error, data, hideOptions) {
    if (loading) {
        return [<TableCell>...</TableCell>];
    } else if (error) {
        return [<TableCell>ERR</TableCell>];
    } else {
        const words = data.getWords;

        for (let i = words.length - 1; i >= 0; i--) {
            const index = Math.floor(Math.random() * i);

            const temp = words[index];
            words[index] = words[i];
            words[i] = temp;
        }

        return words.map(({ romaji, en, word }) => {
            const field = getDisplayField(hideOptions);
            return (
                <React.Fragment>
                   <TableCell>{field === 'word' ? word : <SpoilerText>{word}</SpoilerText>}</TableCell>
                   <TableCell><SpoilerText>{romaji}</SpoilerText></TableCell>
                   <TableCell>{field === 'en' ? en : <SpoilerText>{en}</SpoilerText>}</TableCell>
                </React.Fragment>
            );
        });
    }
}

export default function RecentWordTable(props) {
    const { numDay, hideOptions, numLastDay } = props;
    const hasDay = (numDay && !isNaN(parseInt(numDay, 10)));
    const days = parseInt(numDay, 10);
    const { loading, error, data } = useQueryWordsByDay(days, parseInt(numLastDay, 10), !hasDay);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const newTableData = (hasDay ? getTableData(loading, error, data, hideOptions) : []);;
        setTableData(newTableData);
    }, [loading, error, data, hasDay, hideOptions]);

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
