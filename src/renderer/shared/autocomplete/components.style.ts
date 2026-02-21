import styled from "@emotion/styled";
import { Autocomplete as BaseAutocomplete } from "@mui/material";

export const AutocompleteListItem = styled('li')`
  display: flex;
  gap: 0.5rem;
`;

export const AutocompleteTitle = styled('span')`
  
`;

export const AutocompleteId = styled('span')`
  color: ${({ theme: { colors, darken } }) => darken(colors.secondary.on, 0.1)};
`;

export const Autocomplete = styled(BaseAutocomplete)`
  /* The Input Field */
  & .MuiInput-root {
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    
    &:before {
      border-bottom: 1px solid rgba(255, 0, 51, 0.3);
    }
    
    &:hover:not(.Mui-disabled):before {
      border-bottom: 2px solid #ff0033;
    }

    &:after {
      border-bottom: 2px solid #ff0033;
      filter: drop-shadow(0 0 5px #ff0033);
    }
  }

  /* The Dropdown Menu (Popper) */
  & + .MuiAutocomplete-popper {
    & .MuiPaper-root {
      background: rgba(15, 0, 0, 0.9); /* Deep Crimson Void */
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 0, 51, 0.2);
      color: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      margin-top: 8px;
    }

    & .MuiAutocomplete-listbox {
      padding: 0;
      
      & .MuiAutocomplete-option {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;

        &[aria-selected="true"] {
          background: rgba(255, 0, 51, 0.15);
        }

        &.Mui-focused {
          background: rgba(255, 0, 51, 0.25);
          color: #ffcc00; /* Alchemist Gold highlight on hover/focus */
        }

        &:hover {
          background: rgba(255, 0, 51, 0.2);
        }
      }
    }
  }

  /* Clear and Dropdown arrows */
  & .MuiAutocomplete-endAdornment .MuiSvgIcon-root {
    color: rgba(255, 0, 51, 0.6);
    &:hover {
      color: #ff0033;
    }
  }
`;
