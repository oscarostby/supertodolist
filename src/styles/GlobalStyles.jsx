import styled from 'styled-components';

export const GlobalStyles = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

// Create a GlobalStyle component
export const GlobalStyle = () => (
  <GlobalStyles />
);
