import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

export default function TableComponent({countries}) {
    //console.log("TableComponent countries", countries );
    let prepareCountries = [...countries];

    const sortedCountries = prepareCountries.sort( (a, b) => (a.liveCases > b.liveCases) ? -1 : 1 );
    //console.log("sortedCountries: ", sortedCountries);

    


  return (
    <TableContainer className="TableContainer">
      <Table>
        <TableBody>
          {sortedCountries.map((country) => (
            <TableRow className="tableRow" key={country.name}>
              <TableCell component="th" scope="row">{country.name}</TableCell>
              <TableCell align="right">{country.liveCases}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
