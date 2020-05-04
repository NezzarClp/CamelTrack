import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const GET_RAND_WORDS = gql`
    {
        randWords(numWords: 5) {
            romaji
            word
            en
        }
    }
`;

export default function WordTable(props) {
    const { loading: randLoading, error: randError, data: randData } = useQuery(GET_RAND_WORDS);
    const tableData = randLoading ? [<TableCell>...</TableCell>] : 
        (randError ? [<TableCell>ERR</TableCell>] : 
        randData.randWords.map(({ romaji, en, word }) => (
            <React.Fragment>
                <TableCell>{word}</TableCell>
                <TableCell>{romaji}</TableCell>
                <TableCell>{en}</TableCell>
            </React.Fragment>
        )));
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
