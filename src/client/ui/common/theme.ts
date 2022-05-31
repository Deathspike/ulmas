import * as ui from 'client/ui';

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
          backgroundColor: '#333',
          fontSize: 0,
          overflowY: 'scroll',
          userSelect: 'none'
        },
        '::-webkit-scrollbar': {
          width: '1.5vw'
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#333'
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#FA0',
          border: '0.5vw solid #333',
          borderRadius: '1.5vw',
          minHeight: '3vw'
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
        root: {
          height: '3.5vw'
        },
        gutters: {
          padding: '0 !important'
        },
        regular: {
          minHeight: '0 !important'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1vw',
          boxShadow: 'none',
          fontSize: '1vw',
          height: '2vw',
          lineHeight: '1vw',
          minWidth: '6vw',
          padding: 0
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 2000
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: '1.75vw',
          padding: '0.5vw'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: '0.25vw'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.75vw'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: '1.25vw',
          lineHeight: 1.4
        },
        h1: {
          fontSize: '3vw',
          lineHeight: 1.1
        },
        h2: {
          fontSize: '2vw',
          lineHeight: 1.1
        },
        h3: {
          fontSize: '1.5vw',
          lineHeight: 1.1
        }
      }
    }
  }
});
