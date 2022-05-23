import * as ui from '..';

export const theme = ui.material.createTheme({
  breakpoints: {
    values: {xs: 0, sm: 0, md: 0, lg: 0, xl: 0}
  },
  palette: {
    mode: 'dark',
    primary: {main: '#FA0', contrastText: '#FFF'},
    secondary: {main: '#666', contrastText: '#FFF'}
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowY: 'scroll',
          userSelect: 'none'
        },
        '::-webkit-scrollbar': {
          width: ui.sz(12)
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#333'
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#FA0',
          border: `${ui.sz(4)} solid #333`,
          borderRadius: ui.sz(8)
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {backgroundColor: '#333'}
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {height: ui.sz(32)},
        gutters: {padding: '0 !important'},
        regular: {minHeight: '0 !important'}
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: ui.sz(4),
          fontSize: ui.sz(10),
          lineHeight: ui.sz(10),
          minWidth: ui.sz(48),
          padding: `${ui.sz(2)} ${ui.sz(4)}`
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: ui.sz(15)
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: ui.sz(12),
          lineHeight: ui.sz(16)
        },
        h1: {
          fontSize: ui.sz(26),
          lineHeight: ui.sz(26)
        },
        h2: {
          fontSize: ui.sz(18),
          lineHeight: ui.sz(18)
        }
      }
    }
  }
});
