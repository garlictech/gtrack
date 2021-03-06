module.exports = {
  theme: {
    screens: {
      xs: '0',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
      xxxl: '3820px',
      fivek: '5120px',
      eightk: '7680px',
    },
    fontSize: {
      tiny: '.5rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      colors: {
        default: 'var(--ion-color-primary)',
        primary: 'var(--ion-color-primary)',
        secondary: 'var(--ion-color-secondary)',
        tertiary: 'var(--ion--color-tertiary)',
        success: 'var(--ion-color-success)',
        warning: 'var(--ion-color-warning)',
        danger: 'var(--ion-color-danger)',
        dark: 'var(--ion-color-dark)',
        medium: 'var(--ion-color-medium)',
        light: 'var(--ion-color-light)',
        black: 'var(--ion-color-dark)',
      },
    },
    container: {
      center: true,
      padding: 'var(--container-padding)',
    },
  },
  variants: {
    margin: ['last'],
  },
  plugins: [require('tailwindcss-grid')({})],
  corePlugins: {},
};
