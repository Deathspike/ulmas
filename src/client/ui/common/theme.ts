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
        ':focus': {
          outline: 'none'
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
        },
        '@keyframes spinner': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        }
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
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 2000
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: '1.75vw',
          padding: '0.5vw'
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#555',
          fontSize: '1.25vw'
        },
        input: {
          padding: '0.5vw !important'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: '0.35vw'
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '0.5vw'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '0.5vw'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#444',
          backgroundImage: 'unset'
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
