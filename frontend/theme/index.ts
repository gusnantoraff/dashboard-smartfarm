import { extendTheme } from '@chakra-ui/react';
import { buttonTheme } from './buttonTheme';
import { badgeTheme } from './badgeTheme';

const theme = extendTheme({
  fonts: {
    body: `'Work Sans', sans-serif`,
  },

  components: {
    Button: buttonTheme,
    Badge: badgeTheme,
  },

  colors: {
    black: '#1B212D',

    primary: '#014493',
    primary_hover: '#1B6ACB',

    secondary: '#2379DC',
    secondary_hover: '#5A9BE5',

    tertiary: {
      '01': '#1CDF9B',
      '02': '#D7DF1C',
    },
    text: {
      '01': '#1B212D',
      '02': '#929EAE',
      '03': '#78778B',
    },
    other: {
      '01': '#FAFAFA',
      '02': '#F8F8F8',
      '03': '#F5F5F5',
      '04': '#FDFDFD',
    },
    status: {
      error: '#E5363D',
      // reduce opacity
      error_hover: '#ED787C',
      success: '#19D076',
      success_hover: '#1CDF9B',
      warning: '#FFCC00',
    },
  },
});

export default theme;
