import { Card } from '@mui/material';
import React from 'react';

function ContainerCard({ children }) {
  return (
    <Card sx={{ px: { xs: 2, md: 4 }, py: { xs: 1, md: 3 }, minHeight: 'calc(100dvh - 108px)', position: 'relative' }}>
      {children}
    </Card>
  );
}

export default ContainerCard;
