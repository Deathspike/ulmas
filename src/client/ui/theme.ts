import * as ui from '.';
import {dark} from '@mui/material/styles/createPalette';

export const theme = ui.material.createTheme({
  breakpoints: {values: {xs: 0, sm: 0, md: 0, lg: 0, xl: 0}},
  palette: dark,
  components: {
    MuiToolbar: {
      styleOverrides: {
        gutters: {
          padding: '0 !important',
          paddingLeft: '16px !important'
        }
      }
    }
  }
});
