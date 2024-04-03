import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const btnSecondary = defineStyle({
  borderRadius: '6px',
  fontWeight: 700,
  color: 'white',
  background: 'secondary',
  fontSize: '14px',
  lineHeight: '18px',

  _hover: {
    background: 'secondary_hover',
  },

  _loading: {
    fontSize: '28px',
    color: 'secondary',
    background: 'transparent',
    _hover: {
      color: 'secondary',
      background: 'transparent',
    },
  },
});

const btnSuccess = defineStyle({
  borderRadius: '6px',
  fontWeight: 700,
  color: 'white',
  background: 'status.success',
  fontSize: '14px',
  lineHeight: '18px',

  _disabled: {
    cursor: 'not-allowed',
  },
});

const btnPrimary = defineStyle({
  borderRadius: '6px',
  fontWeight: 700,
  color: 'white',
  background: 'primary',
  fontSize: '14px',
  lineHeight: '18px',

  _hover: {
    background: 'primary_hover',
  },
});

const btnDisabled = defineStyle({
  borderRadius: '6px',
  fontWeight: 700,
  color: 'white',
  background: 'text.02',
  fontSize: '14px',

  _hover: {
    background: 'text.02',
    cursor: 'not-allowed',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: {
    secondary: btnSecondary,
    primary: btnPrimary,
    success: btnSuccess,
    disabled: btnDisabled,
  },
});
