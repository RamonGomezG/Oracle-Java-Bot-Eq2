/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2021 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * @author  jean.de.lavarene@oracle.com
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Configurar el tema oscuro de Material-UI
const theme = createTheme({
  palette: {
    mode: 'dark', // Activar el modo oscuro
    background: {
      default: '#3A3632' // Establece el color de fondo global de la aplicación
    },
    primary: {
      main: '#5F7D4F', // Color principal personalizado
    },
    // Añadir más configuraciones de color según sea necesario
  },
  // Configuraciones adicionales para componentes específicos si es necesario
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
