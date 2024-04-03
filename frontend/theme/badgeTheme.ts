import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const active = defineStyle({
  border: 'none',
  borderRadius: '4px',
  color: 'status.success',
  bg: '#E4F7F0',
});

const inactive = defineStyle({
  border: 'none',
  borderRadius: '4px',
  color: 'status.error',
  bg: '#FAEDED',
});

export const badgeTheme = defineStyleConfig({
  variants: { active, inactive },
});
