import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const lightTheme = {
  accent: '#0095f6',
  bgColor: '#F3F4F6',
  fontColor: 'rgb(38,38,38)',
  borderColor: 'rgb(219,219,219)',
};

export const darkTheme = {
  fontColor: 'lightgray',
  bgColor: '#2c2c2c',
};

export const GlobalStyles = createGlobalStyle`
    ${reset};
    input {
      all:unset;
    }

    * {
      box-sizing:border-box ;
    }
   
    body {
        background-color:${(props) => props.theme.bgColor};
        font-size:14px;
        font-family: sans-serif;
        color: ${(props) => props.theme.fontColor};
    }
    a {
        text-decoration: none;
        opacity: ${(props) => (props.disabled ? 0.3 : 1)};
      }
    a:visited {
      color:${(props) => props.theme.accent};
      text-decoration: none;
    }
`;
