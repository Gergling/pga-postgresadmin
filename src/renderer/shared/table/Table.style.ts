import styled from '@emotion/styled';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

export const TableHead = styled.thead`
  background-color: #f4f4f4;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #efefef;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #ddd;
`;

export const TableCell = styled.td`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;
