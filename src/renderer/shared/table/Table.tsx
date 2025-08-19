import { StyledTable, TableCell, TableHead, TableHeaderCell, TableRow } from "./Table.style";

type Row = Record<string, string | number | boolean | null | undefined>;

export const Table = ({ rows }: { rows: Row[]; }) => {
  if (rows.length === 0) {
    return <p>No data available</p>;
  }

  const columns = Object.keys(rows[0]);

  if (columns.length === 0) {
    return <p>No columns available</p>;
  }

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map(col => <TableHeaderCell key={col}>{col}</TableHeaderCell>)}
        </TableRow>
      </TableHead>
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {columns.map(col => <TableCell key={col}>{row[col] || ''}</TableCell>)}
          </TableRow>
        ))}
      </tbody>
    </StyledTable>
  );
};
