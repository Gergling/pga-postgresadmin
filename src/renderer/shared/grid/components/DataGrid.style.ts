import styled from '@emotion/styled';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)`
  border: 1px solid rgba(255, 0, 51, 0.3) !important;
  color: #ffffff !important;
  font-family: 'JetBrains Mono', monospace !important;
  background-color: rgba(10, 10, 15, 0.4);
  backdrop-filter: blur(4px);

  /* Column Headers */
  & .MuiDataGrid-columnHeaders {
    background-color: rgba(255, 0, 51, 0.05);
    border-bottom: 2px solid #ff0033 !important;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Cells and Rows */
  & .MuiDataGrid-cell {
    border-bottom: 1px solid rgba(255, 0, 51, 0.1) !important;
    &:focus, &:focus-within {
      outline: none !important;
    }
  }

  & .MuiDataGrid-row {
    transition: background-color 0.2s ease;
    &:hover {
      background-color: rgba(255, 0, 51, 0.08) !important;
      cursor: crosshair;
    }
    &.Mui-selected {
      background-color: rgba(255, 204, 0, 0.1) !important; /* Alchemist Gold tint */
      &:hover {
        background-color: rgba(255, 204, 0, 0.15) !important;
      }
    }
  }

  /* Scrollbars - The 'Filament' look */
  & ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  & ::-webkit-scrollbar-thumb {
    background: #ff0033;
    border-radius: 4px;
    box-shadow: 0 0 10px #ff0033;
  }

  /* Footer/Pagination */
  & .MuiDataGrid-footerContainer {
    border-top: 1px solid #ff0033 !important;
    color: #ffcc00;
  }
`;
