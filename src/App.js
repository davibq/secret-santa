import React from 'react';
import './App.css';

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import MainComponent from './components/MainComponent'

const theme = createMuiTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainComponent />
    </ThemeProvider>
  );
}

export default App;
